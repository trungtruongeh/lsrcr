var MY_EMAIL = '';
var SLACK_WEBHOOK = '';
var currentUrl = '';
var currentTitle = '';

function displayError(msg) {
  let errorP = document.getElementById('error');
  if (!errorP) {
    errorP = document.createElement('p');
    errorP.style.color = "red";
    errorP.innerText = "";
    errorP.innerText = msg;
    document.body.appendChild(errorP);
  } else {
    errorP.innerText = "";
    errorP.innerText = msg;
  }
}

async function sendMessageViaWorkflow({
  title,
  url,
}) {
  return await fetch(SLACK_WEBHOOK, {
    method: 'post',
    headers: {
      'Accept': 'application/json, text/plain, */*',
    },
    body: JSON.stringify({
      title,
      url,
      // github_name: author.name,
      // github_avatar: author.avatar,
      // github_href: author.href,
      email: MY_EMAIL,
    }),
  })
    .then(() => {
      document.body.style.minWidth = '400px';
      document.body.textContent = "Sent!";
      document.body.style.fontSize = '16px';
      const channelLink = document.createElement('a');
      channelLink.href = 'https://employmenthero.slack.com/archives/C9EMR5J8J';
      channelLink.innerText = 'Open Slack Channel';
      channelLink.style.marginLeft = '4px';
      console.log(channelLink);
      document.body.appendChild(channelLink);
    })
    .catch(err => {
      document.getElementById('send-btn').removeAttribute('disabled');
      displayError(err);
    })
}

async function parsePrInfo(prUrl) {
  const urlItems = prUrl.split('/');
  console.log(urlItems);
  const pullNumber = urlItems[6];
  const owner = urlItems[3];
  const repo = urlItems[4];

  if (!pullNumber || !owner || !repo) {
    return null;
  }

  // const apiUrl = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullNumber}`;
  //
  // const res = await axios.get(apiUrl, {
  //   headers: {
  //     'Authorization': `Bearer ${GITHUB_AUTH_TOKEN}`
  //   }
  // });
  //
  // console.log(res.data);

  return {
    url: prUrl,
    title: currentTitle,
    // author: {
    //   name: res.data.user.login,
    //   href: res.data.user.html_url,
    //   avatar: res.data.user.avatar_url,
    // },
    // codeowners: [...res.data.requested_reviewers, ...res.data.requested_teams],
  };
}

async function appendInputToPreview(value, id) {
  const previewDiv = document.getElementById('preview');

  const label = document.createElement('label');
  label.innerText = id;
  label.style.marginBottom = '2px';
  label.for = id;
  previewDiv.appendChild(label);

  const titleInput = document.createElement('input');
  titleInput.value = value;
  titleInput.style.minWidth = '400px';
  titleInput.style.marginBottom = '4px';
  titleInput.id = id;
  previewDiv.appendChild(titleInput);
}

async function previewMessage(event) {
  event?.preventDefault();

  const prUrl = currentUrl;
  const previewDiv = document.getElementById('preview');

  const prInfo = await parsePrInfo(prUrl);

  if (prInfo == null) {
    const error = 'Invalid url';
    document.body.style.minWidth = '150px';
    previewDiv.style.color = "red";
    previewDiv.textContent = "";
    previewDiv.textContent = error;
    console.log(previewDiv);
    return;
  }

  previewDiv.textContent = "";

  const titlePreview = document.createElement('h3');
  titlePreview.innerText = "Confirm information";
  previewDiv.appendChild(titlePreview);

  appendInputToPreview(prInfo.title, 'title');
  appendInputToPreview(prInfo.url, 'url');
  // appendInputToPreview(prInfo.author.name, 'author-name');
  // appendInputToPreview(prInfo.author.href, 'author-href');
  // appendInputToPreview(prInfo.author.avatar, 'author-avatar');
  appendInputToPreview(MY_EMAIL, 'my-email');

  const sendButton = document.createElement('button');
  sendButton.textContent = "Send Slack";
  sendButton.style.marginTop = '8px';
  sendButton.id = "send-btn"
  sendButton.addEventListener('click', () => {
    sendButton.setAttribute('disabled', true);
    sendMessageViaWorkflow(prInfo);
  })
  previewDiv.appendChild(sendButton);
}

window.onload = async (e) => {
  e.preventDefault();

  chrome.storage.local.get(['slack-webhook', 'my-email'], function(result) {
    SLACK_WEBHOOK = result['slack-webhook'];
    MY_EMAIL = result['my-email'];

    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var currentTab = tabs[0];
        currentUrl = currentTab.url;
        currentTitle = currentTab.title.split(' · ')[0];
        previewMessage();
      });
    } else {
      currentUrl = window.location.href;
      previewMessage();
    }
  });

  document.getElementById('openOptionsPageButton').addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
  });

};

