/* TODO
 * adicionar verificação de input expr e respetivos erros
 * implementar equivalência
 */

type operandList = {
    [key: string]: boolean;
};

function precedence(char: string) {
    if (char == "~") return 4; // NEGACAO
    else if (char == "A") return 3; // CONJUNCAO
    else if (char == "v") return 2; // DISJUNCAO
    else if (char == "->") return 1; // IMPLICAÇÃO
    else return -1;
}

function convertInfixToPostfix(expr: string, operandList: operandList) {
    const stack = [];
    let res = "";

    for (let i = 0; i < expr.length; i++) {
        let char = expr[i];

        if (char == "-" && expr[i + 1] == ">") {
            char = "->";
            expr = expr.slice(0, i + 1) + expr.slice(i + 2, expr.length);
        }

        if (Object.hasOwn(operandList, char)) {
            res += char;
        } else if (char == "(") {
            stack.push("(");
        } else if (char == ")") {
            while (stack.length > 0 && stack[stack.length - 1] !== "(") {
                res += stack.pop();
            }

            stack.pop();
        } else { // operator
            while (
                stack.length > 0 && stack[stack.length - 1] !== "(" &&
                (precedence(stack[stack.length - 1]) > precedence(char) ||
                    (precedence(stack[stack.length - 1]) === precedence(char) &&
                        char != "~"))
            ) {
                res += stack.pop();
            }

            stack.push(char);
        }
    }

    while (stack.length > 0) {
        res += stack.pop();
    }

    return res;
}

function evalPostfix(expr: string, operandList: operandList) { // evaluate logical proposition
    const stack: boolean[] = [];

    for (let i = 0; i < expr.length; i++) {
        let char = expr[i];

        if (char == "-" && expr[i + 1] == ">") {
            char = "->";
            expr = expr.slice(0, i + 1) + expr.slice(i + 2, expr.length);
        }

        if (Object.hasOwn(operandList, char)) {
            stack.push(operandList[char]);
        } // char is operator
        else if (char == "~") {
            const op1 = stack.pop();

            stack.push(!op1);
        } else if (char == "A") {
            const op1 = stack.pop();
            const op2 = stack.pop();

            if (op1 === undefined || op2 === undefined) return;

            stack.push(op1 && op2);
        } else if (char == "v") {
            const op1 = stack.pop();
            const op2 = stack.pop();

            if (op1 === undefined || op2 === undefined) return;

            stack.push(op1 || op2);
        } else if (char == "->") {
            const op1 = stack.pop();
            const op2 = stack.pop();

            if (op1 === undefined || op2 === undefined) return;

            stack.push((!op2) || op1);
        }
    }

    return stack[0];
}

// =====================================================================================================================
// DECLARAÇÃO DE VARIÁVEIS
const validVarNames = [ // hard-coded
    "a",
    "b",
    "c",
    "d",
    "e",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "w",
    "x",
    "y",
    "z",
];

const opList: operandList = {
    V: true,
    F: false,
};

const input_varCount = prompt("Número de variáveis:");

if (input_varCount == null) Deno.exit(1);
if (isNaN(+input_varCount) || +input_varCount < 0) {
    throw "Número introduzido é inválido";
}

for (let i = 0; i < +input_varCount; i++) {
    console.log("|- VAR " + (i + 1).toString());

    const letra = prompt("  letra (minúscula): ");
    const valor = prompt("  valor (V|F): ");

    if (letra == null || valor == null) Deno.exit(1);
    if (!validVarNames.includes(letra)) {
        throw "Letra introduzida é inválida ou já está a ser utilizada";
    }
    if (!["v", "f"].includes(valor.toLowerCase())) {
        throw "Valor introduzido é inválido";
    }

    validVarNames.splice(validVarNames.indexOf(letra), 1);
    opList[letra] = valor.toLowerCase() == "v";
}

const expr = prompt("Expressão:")?.replaceAll(" ", "");
if (expr == null) Deno.exit(1);

console.log("\n" + evalPostfix(convertInfixToPostfix(expr, opList), opList));
