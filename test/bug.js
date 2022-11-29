const fs = require("fs").promises;
const path = require("path");

// const items = await fs.readdir("stores");
// console.log(items); 

// SyntaxError: await is only valid in async functions and the top level bodies of modules
async function main() {
  // const items = await fs.readdir("stores", { withFileTypes: true });
  // for (let item of items) {
  //   const type = item.isDirectory() ? "folder" : "file";
  //   console.log(`${item.name}: ${type}`);
  // }

  async function findFiles(folderName, arr = []) {
    let result = arr ?? [];
    // 'await' expressions are only allowed within async functions and at the top levels of modules.ts(1308)
    const items = await fs.readdir(folderName, { withFileTypes: true });
    // ❌ items.forEach 使用 async function 包裹后，导致 await 层级 bug
    async function wrapper(items) {
      items.forEach(async (item) => {
        if (path.extname(item.name) === ".json") {
          console.log(`Found file: ${item.name} in folder: ${folderName}`);
          // result.push(`${folderName}${item.name}`);
          result.push(path.join(folderName, item.name));
        } else {
          // this is a folder, so call this method again and pass in
          // the path to the folder
          // await findFiles(path.join(folderName, item.name), result);
          // findFiles(path.join(folderName, item.name), result);
          (async function () {
            await findFiles(path.join(folderName, item.name), result);
          })();
        }
      });
    }
    await wrapper(items);
    // items.forEach((item) => {
    //   if (path.extname(item.name) === ".json") {
    //     console.log(`Found file: ${item.name} in folder: ${folderName}`);
    //     // result.push(`${folderName}${item.name}`);
    //     result.push(path.join(folderName, item.name));
    //   } else {
    //     // this is a folder, so call this method again and pass in
    //     // the path to the folder
    //     (async function wrapper() {
    //       await findFiles(path.join(folderName, item.name), result);
    //     })();
    //     // async function wrapper() {
    //     //   await findFiles(path.join(folderName, item.name), result);
    //     // }
    //     // wrapper();
    //   }
    // });
    // items.forEach(async (item) => {
    //   if (path.extname(item.name) === ".json") {
    //     console.log(`Found file: ${item.name} in folder: ${folderName}`);
    //     // result.push(`${folderName}${item.name}`);
    //     result.push(path.join(folderName, item.name));
    //   } else {
    //     // this is a folder, so call this method again and pass in
    //     // the path to the folder
    //     await findFiles(path.join(folderName, item.name), result);
    //   }
    // });
    // items.forEach((item) => {
    //   if (path.extname(item.name) === ".json") {
    //     console.log(`Found file: ${item.name} in folder: ${folderName}`);
    //     // result.push(`${folderName}${item.name}`);
    //     result.push(path.join(folderName, item.name));
    //   } else {
    //     // this is a folder, so call this method again and pass in
    //     // the path to the folder
    //     findFiles(path.join(folderName, item.name), result);
    //   }
    // });
    return result;
  }

  const files = await findFiles("stores");
  console.log(`✅ files =`, files);
}

main();