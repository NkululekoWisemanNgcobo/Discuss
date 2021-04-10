import { Socket } from "phoenix";

let socket = new Socket("/socket", { params: { token: window.userToken } });

socket.connect();

const createSocket = (TopicId) => {
  // Now that you are connected, you can join channels with a topic:
  let channel = socket.channel(`comments:${TopicId}`, {});
  channel
    .join()
    .receive("ok", (resp) => {
      renderComents(resp.comments);
    })
    .receive("error", (resp) => {
      console.log("Unable to join", resp);
    });

  channel.on(`comments:${TopicId}:new`, renderComment);

  document.querySelector("button").addEventListener("click", () => {
    const content = document.querySelector("textarea").value;

    channel.push("comment:add", { content: content });
  });
};

function renderComents(comments) {
  let email = "Anonymous";
  const renderedComments = comments.map((comment) => {
    if (comment.user) {
      email = comment.user.email;
    }

    return `
    <li class="collection-item">
      ${comment.content}

      <div class="secondary-content">
      ${email}
      </div>
    </li>
    `;
  });

  document.querySelector(".collection").innerHTML = renderedComments.join("");
}

function renderComment(event) {
  let comment = event.comment;
  let email = "Anonymous";
  if (comment.user) {
    email = comment.user.email;
  }

  const renderedComments = `
    <li class="collection-item">
      ${comment.content}
      
      <div class="secondary-content">
      ${email}
      </div>
    </li>
    `;

  document.querySelector(".collection").innerHTML += renderedComments;
}

window.createSocket = createSocket;
