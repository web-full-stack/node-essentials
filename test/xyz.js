const fs = require("fs").promises;
const path = require("path");

async function main() {
  async function findFiles(folderName, arr = []) {
    let result = arr || [];
    const items = await fs.readdir(folderName, { withFileTypes: true });
    // ✅
    for (const item of items) {
      const name = path.join(folderName, item.name);
      if (path.extname(item.name) === ".json") {
        // file
        console.log(`Found file: ${item.name} in folder: ${folderName}`);
        result.push(name);
      } else {
        // folder
        await findFiles(name, result);
      }
    }
    return result;
  }
  const files = await findFiles("stores");
  console.log(`❓files =`, files);
}

main();

// const fs = require("fs").promises;
// const path = require("path");

// async function main() {
//   async function findFiles(folderName, arr = []) {
//     let result = arr || [];
//     const items = await fs.readdir(folderName, { withFileTypes: true });
//     // ❌ items.forEach 使用 async function 包裹后，导致 await 层级 bug
//     items.forEach(async (item) => {
//       const name = path.join(folderName, item.name);
//       if (path.extname(item.name) === ".json") {
//         // file
//         console.log(`Found file: ${item.name} in folder: ${folderName}`);
//         result.push(name);
//       } else {
//         // folder
//         await findFiles(name, result);
//       }
//     });
//     return result;
//   }
//   const files = await findFiles("stores");
//   console.log(`❓files =`, files);
// }

// main();