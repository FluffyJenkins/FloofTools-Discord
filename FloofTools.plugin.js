//META{"name":"FloofTools","website":"https://github.com/FluffyJenkins/FloofTools-Discord","source":"https://github.com/FluffyJenkins/FloofTools-Discord/blob/master/FloofTools.plugin.js"}*//


class FloofTools {
    getName() {
        return "FloofTools";
    }

    getDescription() {
        return "A collection of random things";
    }

    getVersion() {
        return "0.0.0";
    }

    getAuthor() {
        return "FluffyJenkins";
    }

    constructor() {
        this.classesDefault = {
            chat: "chat-3bRxxu",
            searchBar: "searchBar-2_Yu-C",
            messagesWrapper: "messagesWrapper-3lZDfY"
        };
        this.classesNormalized = {
            appMount: "da-appMount",
            chat: "da-chat",
            searchBar: "da-searchBar",
            messagesWrapper: "da-messagesWrapper"
        };
        this.classes = this.classesDefault;
    }


    load() {
        this.log('FloofTools Loaded');
    }

    start() {
        this.log('Starting');

        this.execSync = require('child_process').execSync;

        this.initialized = false;


        setTimeout(this.initialize.bind(this), 5000);

    }

    error(text) {
        return console.error(`[%c${this.getName()}%c] ${text}`,
            'color: #F77; text-shadow: 0 0 1px black, 0 0 2px black, 0 0 3px black;', '');
    }

    observer({addedNodes, removedNodes}) {
        if (!this.classes || !addedNodes || !addedNodes[0] || !addedNodes[0].classList) return;
        let cl = addedNodes[0].classList;

        if (cl.contains(this.classes.searchBar) ||
            cl.contains(this.classes.chat) ||
            cl.contains(this.classes.messagesWrapper)) {
            this.update();
        }
    }

    initialize() {
        if (this.initialized) return;
        this.initialized = true;

        this.update();

        try {
        } catch (err) {
            this.error("Couldn't update");
        }

        this.log("Initialized");
    }

    stop() {
        $('.' + this.classes.chat + ' textarea').off('keydown.flooftools');
        this.log('Stopped');
    }

    unload() {
        this.log('Unloaded');
    }

    log(text) {
        return console.log(`[%c${this.getName()}%c] ${text}`,
            'color: #F77; text-shadow: 0 0 1px black, 0 0 2px black, 0 0 3px black;', '');
    }


    onSwitch() {
    }

    update() {
        let textArea = $('.' + this.classes.chat + ' textarea');
        if (!textArea.length) return;

        let inputBox = textArea[0];
        textArea.off('keydown.flooftools').on('keydown.flooftools', (e) => {
            // Corrupt text either when we press enter or tab-complete
            if ((e.which === 13 || e.which === 9) && inputBox.value) {
                let cursorPos = inputBox.selectionEnd;
                let value = inputBox.value;
                let tailLen = value.length - cursorPos;

                let args = value.match(/(".*?"|[^"\s]+)+(?=\s*|\s*$)/g);

                let setArgs = {"args": []};
                let possibleArgs = ["/figlet", 1];
                for (let i = 0; i < args.length; i++) {
                    let search = possibleArgs.indexOf(args[i]);
                    if (search !== -1) {
                        if (possibleArgs[search + 1] !== 0) {
                            setArgs[args[i]] = args[i + 1];
                            i++;
                        } else {
                            setArgs[args[i]] = true;
                        }
                    } else {
                        setArgs["args"].push(args[i]);
                    }
                }

                // If we pressed Tab, perform corruption only if the cursor is right after the closing braces.
                if (e.which === 9 && !value.substring(0, inputBox.selectionEnd).endsWith(':'))
                    return;
                try {


                    if (setArgs["/figlet"]) {
                        value = "`"+this.execSync("figlet "+setArgs["/figlet"], {encoding: 'utf-8'})+"`";
                    }

                    inputBox.focus();
                    inputBox.select();
                    document.execCommand("insertText", false, value);

                    // If we're using tab-completion, keep the cursor position, in case we were in the middle of a line
                    if (e.which === 9) {
                        let newCursorPos = value.length - tailLen;
                        inputBox.setSelectionRange(newCursorPos, newCursorPos);
                    }
                } catch (err) {
                    //console.log(err.message);
                }
            }
        });

        this.initialized = true;
    }
}
/*@end @*/