/**
 * @name PaczekMediaDownloader
 * @version 1.1.3
 * @description Downloads all images and videos in a channel with one click.
 * @author Paczek224
 */
module.exports = class PaczekMediaDownloader {
  constructor() {
    this.button = null;
    this.observer = null;
    this.handleKeyboardShortcut = null; // Initialize the keyboard shortcut handler
  }

  start() {
    this.addObserver();
    this.addKeyboardShortcut();
  }

  stop() {
    if (this.button) this.button.remove();
    if (this.observer) this.observer.disconnect();
    if (this.handleKeyboardShortcut) {
      document.removeEventListener("keydown", this.handleKeyboardShortcut);
    }
  }

  addObserver() {
    const container = document.querySelector(".appMount-3lHmkl");
    if (!container) return;

    this.observer = new MutationObserver(() => {
      const toolbar = document.querySelector(".toolbar-1t6TWx");
      if (toolbar && !toolbar.querySelector(".PaczekMedia-download-button")) {
        this.addDownloadButton(toolbar);
      }
    });

    this.observer.observe(container, { childList: true, subtree: true });
  }

  addDownloadButton(toolbar) {
    this.button = document.createElement("button");
    this.button.innerText = "Pobierz wszystkie media";
    this.button.className = "PaczekMedia-download-button";
    this.button.style.cssText = `
      margin-left: 10px; 
      padding: 5px; 
      background-color: #7289DA; 
      color: white; 
      border: none; 
      border-radius: 5px; 
      cursor: pointer;
    `;

    this.button.onclick = () => this.downloadAllMedia();

    toolbar.appendChild(this.button);
  }

  addKeyboardShortcut() {
    this.handleKeyboardShortcut = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'D') {
        event.preventDefault();
        this.downloadAllMedia();
      }
    };

    document.addEventListener("keydown", this.handleKeyboardShortcut);
  }

  async downloadAllMedia() {
    const messages = Array.from(document.querySelectorAll("[role='row']")); // Select all messages
    const mediaLinks = [];

    messages.forEach((message) => {
      const attachments = message.querySelectorAll("a[href*='.jpg'], a[href*='.jpeg'], a[href*='.png'], a[href*='.gif'], a[href*='.mp4'], a[href*='.webm']");
      attachments.forEach((attachment) => {
        mediaLinks.push(attachment.href);
      });
    });

    console.log("Znalezione linki do mediów:", mediaLinks); // Log found links

    if (mediaLinks.length === 0) {
      alert("Nie znaleziono plików multimedialnych w bieżącym widoku.");
      return;
    }

    mediaLinks.forEach((link) => {
      const a = document.createElement("a");
      a.href = link;
      a.download = link.split('/').pop(); // File name
      console.log(`Pobieranie: ${a.download}`); // Log file name
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });

    alert("Pliki są pobierane do domyślnego folderu pobrań.");
  }
};

