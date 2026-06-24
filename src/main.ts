#!/usr/bin/env node

import { tyoiCli } from "./cli/main.js";

async function boot() {
    await tyoiCli();
}
await boot();
