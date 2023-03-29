import EventSource from 'eventsource';

const path = encodeURIComponent(window.location.pathname);
const source = new EventSource(`/dev?path=${path}`);
source.onmessage = (msg) => {
  if (msg.data === 'reload') {
    window.location.reload();
  }
};
