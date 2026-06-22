import type { DurableObjectState, WebSocket } from '@cloudflare/workers-types'

interface GroceryItem {
  id: string
  name: string
  quantity?: string
  category: string
  checked: boolean
  addedBy: string
  checkedBy?: string
  checkedAt?: number
  position: number
}

interface PantryItem {
  id: string
  name: string
  quantity?: string
  category: string
  addedBy: string
  addedAt: number
}

interface Session {
  ws: WebSocket
  partnerName: string
}

export class HouseholdSync {
  private state: DurableObjectState
  private sessions: Map<string, Session> = new Map()
  private items: GroceryItem[] = []
  private pantryItems: PantryItem[] = []

  constructor(state: DurableObjectState) {
    this.state = state
    this.initDatabase()
  }

  private async initDatabase() {
    const sql = this.state.storage.sql
    sql.exec(`
      CREATE TABLE IF NOT EXISTS grocery_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        quantity TEXT,
        category TEXT DEFAULT 'Other',
        checked INTEGER DEFAULT 0,
        added_by TEXT NOT NULL,
        checked_by TEXT,
        checked_at INTEGER,
        position INTEGER DEFAULT 0
      );
    `)

    sql.exec(`
      CREATE TABLE IF NOT EXISTS pantry (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        quantity TEXT,
        category TEXT DEFAULT 'Other',
        added_by TEXT NOT NULL,
        added_at INTEGER NOT NULL
      );
    `)

    await this.loadItems()
    await this.loadPantry()
  }

  private async loadItems() {
    const result = this.state.storage.sql.exec(`
      SELECT id, name, quantity, category, checked, added_by, checked_by, position
      FROM grocery_items
      ORDER BY position ASC
    `)

    this.items = []
    for (const row of result) {
      this.items.push({
        id: row.id as string,
        name: row.name as string,
        quantity: row.quantity as string | undefined,
        category: (row.category as string) || 'Other',
        checked: Boolean(row.checked),
        addedBy: row.added_by as string,
        checkedBy: row.checked_by as string | undefined,
        position: (row.position as number) || 0,
      })
    }
  }

  private async loadPantry() {
    const result = this.state.storage.sql.exec(`
      SELECT id, name, quantity, category, added_by, added_at
      FROM pantry
      ORDER BY added_at DESC
    `)

    this.pantryItems = []
    for (const row of result) {
      this.pantryItems.push({
        id: row.id as string,
        name: row.name as string,
        quantity: row.quantity as string | undefined,
        category: (row.category as string) || 'Other',
        addedBy: row.added_by as string,
        addedAt: (row.added_at as number) || Date.now(),
      })
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url)

    if (request.headers.get('Upgrade') === 'websocket') {
      const [clientWs, serverWs] = Object.values(new WebSocketPair())
      const partnerName = url.searchParams.get('partner') || 'Unknown'

      await this.handleWebSocket(serverWs, partnerName)

      return new Response(null, { status: 101, webSocket: clientWs })
    }

    return new Response('Not Found', { status: 404 })
  }

  private async handleWebSocket(ws: WebSocket, partnerName: string) {
    const sessionId = crypto.randomUUID()
    this.sessions.set(sessionId, { ws, partnerName })

    ws.accept()

    this.sendToSocket(ws, {
      type: 'SYNC_STATE',
      items: this.items,
      pantryItems: this.pantryItems,
    })

    ws.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string)
        await this.handleMessage(data, partnerName, sessionId)
      } catch (err) {
        console.error('Failed to handle message:', err)
        this.sendToSocket(ws, {
          type: 'ERROR',
          message: 'Failed to process message',
        })
      }
    })

    ws.addEventListener('close', () => {
      this.sessions.delete(sessionId)
    })

    ws.addEventListener('error', () => {
      this.sessions.delete(sessionId)
    })
  }

  private async handleMessage(data: unknown, partnerName: string, sessionId: string) {
    const message = data as { type: string; [key: string]: unknown }

    switch (message.type) {
      case 'ADD_ITEM': {
        const { name, quantity, category } = message as {
          name: string
          quantity?: string
          category?: string
        }

        const item: GroceryItem = {
          id: crypto.randomUUID(),
          name,
          quantity,
          category: category || 'Other',
          checked: false,
          addedBy: partnerName,
          position: this.items.length,
        }

        this.items.push(item)
        await this.saveItem(item)

        this.broadcast({
          type: 'ITEM_ADDED',
          item,
        })
        break
      }

      case 'CHECK_ITEM': {
        const { id, checked, checkedBy } = message as {
          id: string
          checked: boolean
          checkedBy?: string
        }

        const item = this.items.find((i) => i.id === id)
        if (item) {
          item.checked = checked
          if (checked) {
            item.checkedBy = checkedBy
            item.checkedAt = Date.now()
          } else {
            item.checkedBy = undefined
            item.checkedAt = undefined
          }

          await this.updateItem(item)

          this.broadcast({
            type: 'ITEM_UPDATED',
            item,
          })
        }
        break
      }

      case 'DELETE_ITEM': {
        const { id } = message as { id: string }

        const index = this.items.findIndex((i) => i.id === id)
        if (index !== -1) {
          this.items.splice(index, 1)
          await this.deleteItemById(id)

          this.items.forEach((item, idx) => {
            item.position = idx
          })
          await this.saveAllPositions()

          this.broadcast({
            type: 'ITEM_DELETED',
            id,
          })
        }
        break
      }

      case 'REORDER_ITEMS': {
        const { itemIds } = message as { itemIds: string[] }

        itemIds.forEach((id, index) => {
          const item = this.items.find((i) => i.id === id)
          if (item) {
            item.position = index
          }
        })

        this.items.sort((a, b) => a.position - b.position)
        await this.saveAllPositions()

        this.broadcast({
          type: 'ITEMS_REORDERED',
          items: this.items,
        })
        break
      }

      case 'ADD_PANTRY': {
        const { name, quantity, category } = message as {
          name: string
          quantity?: string
          category?: string
        }

        const item: PantryItem = {
          id: crypto.randomUUID(),
          name,
          quantity,
          category: category || 'Other',
          addedBy: partnerName,
          addedAt: Date.now(),
        }

        this.pantryItems.push(item)
        await this.savePantryItem(item)

        this.broadcast({
          type: 'PANTRY_ADDED',
          item,
        })
        break
      }

      case 'DELETE_PANTRY': {
        const { id } = message as { id: string }

        const index = this.pantryItems.findIndex((i) => i.id === id)
        if (index !== -1) {
          this.pantryItems.splice(index, 1)
          await this.deletePantryItemById(id)

          this.broadcast({
            type: 'PANTRY_DELETED',
            id,
          })
        }
        break
      }

      case 'MOVE_TO_PANTRY': {
        const { groceryId } = message as { groceryId: string }

        const groceryItem = this.items.find((i) => i.id === groceryId)
        if (groceryItem) {
          const pantryItem: PantryItem = {
            id: crypto.randomUUID(),
            name: groceryItem.name,
            quantity: groceryItem.quantity,
            category: groceryItem.category,
            addedBy: partnerName,
            addedAt: Date.now(),
          }

          this.pantryItems.push(pantryItem)
          await this.savePantryItem(pantryItem)

          this.items = this.items.filter((i) => i.id !== groceryId)
          await this.deleteItemById(groceryId)
          this.items.forEach((item, idx) => {
            item.position = idx
          })
          await this.saveAllPositions()

          this.broadcast({
            type: 'PANTRY_ADDED',
            item: pantryItem,
          })
          this.broadcast({
            type: 'ITEM_DELETED',
            id: groceryId,
          })
        }
        break
      }

      case 'BULK_ADD_ITEMS': {
        const { items: newItems } = message as { items: { name: string; quantity?: string; category?: string }[] }

        const added: GroceryItem[] = []
        for (const itemData of newItems) {
          const existing = this.items.find((i) => i.name.toLowerCase() === itemData.name.toLowerCase())
          if (!existing) {
            const item: GroceryItem = {
              id: crypto.randomUUID(),
              name: itemData.name,
              quantity: itemData.quantity,
              category: itemData.category || 'Other',
              checked: false,
              addedBy: partnerName,
              position: this.items.length,
            }
            this.items.push(item)
            await this.saveItem(item)
            added.push(item)
          }
        }

        if (added.length > 0) {
          this.broadcast({
            type: 'BULK_ITEMS_ADDED',
            items: added,
          })
        }
        break
      }

      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  private sendToSocket(ws: WebSocket, message: unknown) {
    try {
      ws.send(JSON.stringify(message))
    } catch (err) {
      console.error('Failed to send message to socket:', err)
    }
  }

  private broadcast(message: unknown, excludeSession?: string) {
    this.sessions.forEach((session, sessionId) => {
      if (sessionId !== excludeSession) {
        this.sendToSocket(session.ws, message)
      }
    })
  }

  private async saveItem(item: GroceryItem) {
    this.state.storage.sql.exec(
      `INSERT INTO grocery_items (id, name, quantity, category, checked, added_by, position)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      item.id,
      item.name,
      item.quantity || null,
      item.category,
      item.checked ? 1 : 0,
      item.addedBy,
      item.position
    )
  }

  private async updateItem(item: GroceryItem) {
    this.state.storage.sql.exec(
      `UPDATE grocery_items
       SET checked = ?, checked_by = ?, checked_at = ?
       WHERE id = ?`,
      item.checked ? 1 : 0,
      item.checkedBy || null,
      item.checkedAt || null,
      item.id
    )
  }

  private async deleteItemById(id: string) {
    this.state.storage.sql.exec(`DELETE FROM grocery_items WHERE id = ?`, id)
  }

  private async saveAllPositions() {
    const stmt = this.state.storage.sql.prepare(
      `UPDATE grocery_items SET position = ? WHERE id = ?`
    )

    for (const item of this.items) {
      stmt.bind(item.position, item.id).run()
    }
  }

  private async savePantryItem(item: PantryItem) {
    this.state.storage.sql.exec(
      `INSERT INTO pantry (id, name, quantity, category, added_by, added_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      item.id,
      item.name,
      item.quantity || null,
      item.category,
      item.addedBy,
      item.addedAt
    )
  }

  private async deletePantryItemById(id: string) {
    this.state.storage.sql.exec(`DELETE FROM pantry WHERE id = ?`, id)
  }
}
