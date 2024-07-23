// TODO: WIP - Will be used by AeroGel.ts
/*
// {
let unmatchedBraceOpens = 0;

function isOutsideOfBrace(): boolean {
    return unmatchedBraceOpens.length === 0
}

interface ReplacementsObjPaths {
    let: string
    const: string,
}

export default class VarRewriter {
    charArr: number[] = [];
    // counters
    bwI = 0; // the padding being the whitespace between the var keyword and =
    initialBwI: = 0;
    replacementsObjPaths: ReplacementsObjPaths;
    construct(charArr: number[], replacementsObjPaths: ReplacementsObjPaths) {
        this.charArr = charArr;
        this.bwI = i;
        this.replacementsObjPaths = replacementObjPaths;
    }
    handleExpression() {
        this.initialBwi = i;
        for (bwI = this.initalBwi; bwI >= 0; bw--) { // bwI = backwards index {
            let char = previous();
            let numPadding = 0;
            if (char === " " || char === "\n") { // if is whitespace
                handlePaddingBeforeExpression();
            } else if (char === "t") {
                handleVarKeyword();
            } else {
                return;
            }*\/
        }
    }
    handlePaddingBeforeExpression(): [number, string] { // number = depth into padding, char = the last char before ends
        let depthIntoPadding = 0;
        // keep incrementing until another char is found (var name or deconstruct)

        return depthIntoPadding = 0;
    }
    handlePaddingBeforeVarName(): [number, string] {
        let depthIntoPadding = 0;
        // keep incrementing until another char is found (var keyword)
        return depthIntoPadding = 0;
    }
    handleArrDeconstruct() {
        let closingBracketFound = false
        let inBetweenChars = [];
        var char = "";
        for (; i <= 0 || closingBracketFound;
            () => {
                char = next()
            }) // c = count {
            const char =
    }


    handleObjDeconstruct() {

    }
    handleVarName(): void {

    }
    /**
     * @returns the replacement offset 
     *\/
    handleVarKeyword(): number {
        // We only learn this when counting down twice
        isKeywordConst = false;
        isKeywordLet = false;
        i--;
        let offset = 0;
        if (previous() === "e" && previous() === "t") // let
            offset += replaceCharsFromCurrIndex(3, replacementsObjPaths.let);
        else if (previous() == "s" && previous() === "n" && previous === "o" && previous === "c") // const {
            offset += replaceCharsFromCurrIndex(5, replacementsObjPaths.const);
        i += offset;
        return offset;
    }
    /** Count down and get the next character
     *  @returns the previous character
     *\/
    previous(): string {
        bwI--;
        return charArr[bwI];
    }
    /**
     * @returns the replacement count which is later used as an offset for the previous indices collected for the whitespace so that we can actually remove them with the data we collected
     *\/
    replaceCharsFromCurrIndex(insertAfter: number, replacement: string): number { // insertafter is when it stops replacing and starts appending new indices as it goes along
        // insert the remaining chars
        charArr.splice(i, insertAfter, ...replacementArr;
            // count down
            let rC = 0
            for (rC; rC < rC.length - 1;
                () => {
                    rC--;
                    i--;
                }); // rC - replacement count
        }
    }
}


const charArr = Array.from(DATA);
let i = 0;
for (; i < charArr.length; i++) {
    if (char === "{") // Unmatched brace open
        unmatchedBraceOpens++;
    else if (char === "}") {
		unmatchedBraceCloses--;
      	if (unmatchedBraceCloses === 0)
          
    }
    else if (
        isOutsideOfBrace() &&
        // Expression found
        char === "x"
    ) {
        handleExpression();
    }
}

class RegExpRewriter() {
    const / location /
}

class DPSCRewriter() {}
*/
