const input = document.querySelector('.input');
const deleteBtn = document.querySelector('.delete');
const btns = document.querySelectorAll('.btn');
let currentValue = "0";
let shouldReset = false;

function update() {
  input.innerText = currentValue;
}

function checkParenthesesBalance(str) {
  let balance = 0;
  for (let char of str) {
    if (char === '(') balance++;
    if (char === ')') balance--;
    if (balance < 0) return false;
  }
  return balance;
}

function addPressAnimation(btn) {
  const removePressed = () => {
    btn.classList.remove('pressed');
  };

  btn.addEventListener('mousedown', () => {
    btn.classList.add('pressed');
  });

  btn.addEventListener('mouseup', () => {
    setTimeout(removePressed, 200);
  });

  btn.addEventListener('mouseleave', removePressed);

  btn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    btn.classList.add('pressed');
  });

  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    setTimeout(removePressed, 200);
  });

  btn.addEventListener('touchcancel', removePressed);
}

btns.forEach(addPressAnimation);

deleteBtn.addEventListener("click", () => {
  currentValue = currentValue.slice(0, -1) || "0";
  update();
})

btns.forEach(btn => {

  btn.addEventListener("click", () => {
    const value = btn.innerText;

    if (value >= "0" && value <= "9") {
      if (currentValue === "0" || shouldReset) {
        currentValue = value;
        shouldReset = false;
      } else {
        currentValue += value;
      }
      update();
    }

    if (value === ".") {
      if (shouldReset) {
        currentValue = "0.";
        shouldReset = false;
      } else if (!currentValue.includes(".")) {
        currentValue += value;
      }
      update();
    }

    if (value === "AC") {
      currentValue = "0";
      shouldReset = false;
      update();
    }

    if (value === "%") {
      if (currentValue !== "0" && currentValue !== "") {
        currentValue = (parseFloat(currentValue) / 100).toString();
        update();
      }
    }

    if (value === "+/-") {
      if (currentValue !== "0" && currentValue !== "") {
        const lastOperatorIndex = Math.max(
          currentValue.lastIndexOf("+"),
          currentValue.lastIndexOf("-"),
          currentValue.lastIndexOf("*"),
          currentValue.lastIndexOf("/")
        );

        if (lastOperatorIndex === -1) {
          if (currentValue.startsWith("-")) {
            currentValue = currentValue.slice(1);
          } else {
            currentValue = "-" + currentValue;
          }
        } else {
          const beforeLast = currentValue.slice(0, lastOperatorIndex + 1);
          const lastNumber = currentValue.slice(lastOperatorIndex + 1);

          if (lastNumber.startsWith("-")) {
            currentValue = beforeLast + lastNumber.slice(1);
          } else {
            currentValue = beforeLast + "-" + lastNumber;
          }
        }
        update();
      }
    }

    if (value === "()") {
      if (currentValue === "0" || shouldReset) {
        currentValue = "(";
        shouldReset = false;
      } else {
        const lastChar = currentValue.slice(-1);
        const balance = checkParenthesesBalance(currentValue);

        if (balance === 0) {
          if (["+", "-", "*", "/", "("].includes(lastChar)) {
            currentValue += "(";
          } else {
            currentValue += "*(";
          }
        } else if (balance > 0) {
          if (["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ")", "."].includes(lastChar)) {
            currentValue += ")";
          } else {
            currentValue += "(";
          }
        }
      }
      update();
    }

    if (["+", "-", "*", "/", "×"].includes(value)) {
      if (value === "/" && currentValue.endsWith("/0")) {
        alert("Делить на 0 нельзя");
        return;
      }

      const operator = value === "×" ? "*" : value;

      if (!["+", "-", "*", "/"].includes(currentValue.slice(-1))) {
        currentValue += operator;
        shouldReset = false;
        update();
      }
    }

    if (value === "=") {
      try {
        const balance = checkParenthesesBalance(currentValue);
        if (balance > 0) {
          alert("Не хватает закрывающих скобок");
          return;
        } else if (balance < 0) {
          alert("Не хватает открывающих скобок");
          return;
        }

        if (currentValue.includes("/0") && !currentValue.includes("/0.")) {
          alert("Делить на 0 нельзя");
          return;
        }

        const expression = currentValue.replace(/×/g, "*");
        const result = eval(expression);

        if (!isFinite(result)) {
          alert("Недопустимая операция");
          currentValue = "0";
        } else {
          const roundedResult = Math.round(result * 100000000) / 100000000;
          currentValue = roundedResult.toString();
        }

        shouldReset = true;
        update();
      } catch (error) {
        alert("Ошибка в выражении");
        currentValue = "0";
        update();
      }
    }
  })
});