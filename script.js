let ws = null;

$.fn.getValAndClear = function() {
  let val = this.val();
  this.val("");
  return val;
};

$(function() {
  if (window.username) {
    startChat();
  }
});

function startChat() {
  ws = adonis.Ws("ws://127.0.0.1:3333").connect();

  ws.on("open", () => {
    $(".connection-status").addClass("connected");
    subscribeToChannel();
  });

  ws.on("error", () => {
    $(".connection-status").removeClass("connected");
  });
}

function subscribeToChannel() {
  const chat = ws.subscribe("chat");

  chat.on("error", () => {
    $(".connection-status").removeClass("connected");
  });

  chat.on("message", message => {
    // console.log(message)
    $(".messages").append(`
      <div class="message"><h3> ${message.username}</h3><p> ${message.body} </p></div>
    `);
  });
}

$("#message").keyup(function(e) {
  if (e.which === 13) {
    e.preventDefault();
    const message = $(this).getValAndClear();
    console.log(message);

    ws.getSubscription("chat").emit("message", {
      username: window.username,
      body: message
    });
  }
});
