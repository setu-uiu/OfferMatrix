/**
 * Simple file-based persistence for mock data.
 * Reads/writes JSON files in server/data/ so changes survive server restarts.
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '../../data')

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

/**
 * Load a collection from disk. If the file doesn't exist, write the defaults first.
 * @param {string} name - filename without extension (e.g. 'users')
 * @param {Array} defaults - default data to seed if file doesn't exist
 */
export function load(name, defaults) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaults, null, 2))
    return defaults
  }
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'))
  } catch {
    fs.writeFileSync(file, JSON.stringify(defaults, null, 2))
    return defaults
  }
}

/**
 * Persist a collection to disk.
 * @param {string} name - filename without extension
 * @param {Array} data - current data array to save
 */
export function save(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}
