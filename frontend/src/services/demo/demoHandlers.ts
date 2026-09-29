import { NOT_MINE, handleDemoContent } from "./demoContent";
import { handleDemoFiles } from "./demoFiles";
import { handleDemoStock } from "./demoStock";

export { NOT_MINE };
export { lowStockCount } from "./demoStock";

/** Route handlers split out of demoApi; each returns NOT_MINE for routes it doesn't serve. */
export const DEMO_HANDLERS = [handleDemoContent, handleDemoFiles, handleDemoStock];
