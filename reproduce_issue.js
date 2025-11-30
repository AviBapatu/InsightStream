
const bookmarks = [
    { article: { title: "Alpha", source: { name: "Source1" } }, savedAt: "2023-01-01" },
    { article: { title: "Beta", source: { name: "Source2" } }, savedAt: "2023-01-02" },
];

let rawSearch = "";
let search = "";
let filterSource = "all";
let sortBy = "recent";

function getDisplayed() {
    let list = [...bookmarks];

    // search
    if (search) {
        const q = search.toLowerCase();
        list = list.filter(
            (b) =>
                (b.article.title || "").toLowerCase().includes(q)
        );
    }

    // filter by source
    if (filterSource !== "all") {
        list = list.filter((b) => b.article.source?.name === filterSource);
    }

    return list;
}

// 1. Initial state
console.log("Initial:", getDisplayed().length); // 2

// 2. User types "Alpha"
rawSearch = "Alpha";
// Effect runs after delay
search = rawSearch.trim();

console.log("Search 'Alpha':", getDisplayed().length); // 1
console.log("Displayed:", getDisplayed().map(b => b.article.title));

// 3. User clicks Reset
// Handler:
rawSearch = "";
// NEW LOGIC: Immediate effect
if (!rawSearch) {
    search = "";
} else {
    // debounce would happen here
}

filterSource = "all";
sortBy = "recent";

console.log("After Reset:", getDisplayed().length); // 2
console.log("Displayed:", getDisplayed().map(b => b.article.title));
