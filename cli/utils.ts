import path from "path"
import { fileURLToPath } from "url"

// Path is in relation to a single index.js file inside ./dist
const __filename = fileURLToPath(import.meta.url)
const distPath = path.dirname(__filename)

export const PKG_ROOT = path.join(distPath, "../")

export const getVersion = () => {
	const pkg = require(path.join(PKG_ROOT, "package.json"))
	return pkg.version ?? "0.0.1"
}
