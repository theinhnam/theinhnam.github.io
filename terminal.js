const output = document.getElementById('output');
const input = document.getElementById('command-input');

const personalInfo = `Nguyen Duy Thanh Nam
💻 20 y/o - Developer and Researcher | 🌏 | 🇻🇳 Vietnam
🔗 GitHub: https://github.com/theinhnam
✉ Email: namndt1773@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/theinhnam/
🔗 Facebook: https://www.facebook.com/kridgez
🔗 Instagram: https://www.instagram.com/becomenam/

Type 'help' to see available commands.
`;

const skillsList = [
  'Angular',
  'Python (Flask)',
  'Java'
];

const socials = {
  github: 'https://github.com/theinhnam',
  linkedin: 'https://www.linkedin.com/in/theinhnam/',
  facebook: 'https://www.facebook.com/kridgez',
  instagram: 'https://www.instagram.com/becomenam/',
};

const commands = {
  help() {
    return `Available commands:
help       - Show this help text
about      - Show personal information
skills     - Show skills list
socials    - Show social links
clear      - Clear the terminal
`;
  },
  about() {
    return personalInfo;
  },
  skills() {
    return 'Skills:\n- ' + skillsList.join('\n- ');
  },
  socials() {
    return Object.entries(socials).map(([key, url]) => `${key}: ${url}`).join('\n');
  },
  clear() {
    output.textContent = '';
    return '';
  }
};

const history = [];
let historyIndex = -1;

typewriterOutput(personalInfo);

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const cmdRaw = input.value.trim();
    const cmd = cmdRaw.toLowerCase();

    if (!cmd) return;

    history.push(cmdRaw);
    historyIndex = history.length;

    appendLine(`➜ ${cmdRaw}`);

    if (commands[cmd]) {
      typewriterOutput(commands[cmd]());
    } else {
      typewriterOutput(`Command not found: ${cmd}\nType 'help' to see available commands.`);
    }

    input.value = '';
    scrollToBottom();
  } else if (e.key === 'ArrowUp') {
    if (history.length && historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
    e.preventDefault();
  } else if (e.key === 'ArrowDown') {
    if (history.length && historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = '';
    }
    e.preventDefault();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    const current = input.value.trim().toLowerCase();
    if (!current) return;

    const matches = Object.keys(commands).filter(c => c.startsWith(current));
    if (matches.length === 1) {
      input.value = matches[0];
    } else if (matches.length > 1) {
      appendLine(`Possible commands: ${matches.join(', ')}`);
      scrollToBottom();
    }
  }
});

function appendLine(text) {
  const line = document.createElement('div');
  line.classList.add('line');
  line.textContent = text;
  output.appendChild(line);
  scrollToBottom();
}

function typewriterOutput(text, delay = 15) {
  return new Promise((resolve) => {
    const lines = text.split('\n');
    let lineIndex = 0;

    function typeLine() {
      if (lineIndex >= lines.length) {
        resolve();
        return;
      }
      const lineText = lines[lineIndex];
      const lineEl = document.createElement('div');
      lineEl.classList.add('line');
      output.appendChild(lineEl);
      scrollToBottom();

      let charIndex = 0;
      function typeChar() {
        if (charIndex <= lineText.length) {
          lineEl.textContent = lineText.slice(0, charIndex);
          charIndex++;
          scrollToBottom();
          setTimeout(typeChar, delay);
        } else {
          lineIndex++;
          typeLine();
        }
      }
      typeChar();
    }

    typeLine();
  });
}

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}
