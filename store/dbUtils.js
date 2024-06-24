import * as SQLite from "expo-sqlite";

const database = SQLite.openDatabase("dictionary.db");

export async function init() {
    return new Promise((resolve, reject) => {
        database.transaction(
            (tx) => {
                tx.executeSql(`CREATE TABLE IF NOT EXISTS words (
            word TEXT PRIMARY KEY NOT NULL,
            phonetics TEXT,
            audio TEXT,
            meaning TEXT,
            partOfSpeech TEXT,
            dateForgets INTEGER,
            dateTotallyForgets INTEGER,
            forgettingSpan INTEGER,
            status INTEGER
        )`);
                tx.executeSql(
                    `CREATE TABLE IF NOT EXISTS theme (
              id INTEGER PRIMARY KEY,
              isDark BOOLEAN
            )`
                );
                tx.executeSql(
                    "INSERT OR IGNORE INTO theme (id, isDark) VALUES (1, 1)"
                );
            },
            (error) => {
                console.log("Database initialization error:", error);
                reject(error);
            },
            () => {
                resolve();
            }
        );
    });
}

export function getWords() {
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                "SELECT * FROM words",
                [],
                (_, { rows: { _array } }) => {
                    resolve(_array);
                },
                (_, error) => reject(error)
            );
        });
    });
}

export function getTheme() {
    return new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                "SELECT isDark FROM theme WHERE id = 1",
                [],
                (_, results) => {
                    if (results.rows.length > 0) {
                        const isDark = Boolean(results.rows.item(0).isDark);
                        resolve(isDark);
                    }
                },
                (_, error) => {
                    console.log(error);
                    reject(error);
                }
            );
        });
    });
}

export function addWord(wordData) {
    const {
        word,
        phonetics,
        audio,
        meaning,
        partOfSpeech,
        dateForgets,
        dateTotallyForgets,
        forgettingSpan,
        status,
    } = wordData;
    database.transaction((tx) => {
        tx.executeSql(
            `INSERT INTO words (
                word,
                phonetics,
                audio,
                meaning,
                partOfSpeech,
                dateForgets,
                dateTotallyForgets,
                forgettingSpan,
                status
            ) VALUES (?,?,?,?,?,?,?,?,?);`,
            [
                word,
                phonetics,
                audio,
                meaning,
                partOfSpeech,
                dateForgets,
                dateTotallyForgets,
                forgettingSpan,
                status,
            ],
            // () => callback(),
            (_, error) => console.log(error)
        );
    });
}
export function updateWord(wordData) {
    const {
        word,
        phonetics,
        audio,
        meaning,
        partOfSpeech,
        dateForgets,
        dateTotallyForgets,
        forgettingSpan,
        status,
    } = wordData;
    database.transaction((tx) => {
        tx.executeSql(
            `UPDATE words
             SET
                phonetics = ?,
                audio = ?,
                meaning = ?,
                partOfSpeech = ?,
                dateForgets = ?,
                dateTotallyForgets = ?,
                forgettingSpan = ?,
                status = ?
            WHERE
                word = ?`,
            [
                phonetics,
                audio,
                meaning,
                partOfSpeech,
                dateForgets,
                dateTotallyForgets,
                forgettingSpan,
                status,
                word,
            ],
            (_, result) => {
                console.log("Word updated:", result);
            },
            (_, error) => {
                console.log("Error updating word:", error);
            }
        );
    });
}

export function deleteWord(wordText) {
    database.transaction((tx) => {
        tx.executeSql(
            "DELETE FROM words WHERE word = ?",
            [wordText],
            (_, result) => {
                console.log("Word deleted:", result);
            },
            (_, error) => {
                console.log("Error deleting word:", error);
            }
        );
    });
}

export function setTheme(isDark) {
    database.transaction((tx) => {
        tx.executeSql(
            "UPDATE theme SET isDark = ? WHERE id = 1",
            [isDark ? 1 : 0],
            (_, result) => {
                console.log("Theme updated:", result);
            },
            (_, error) => {
                console.log("Error updating theme:", error);
            }
        );
    });
}
