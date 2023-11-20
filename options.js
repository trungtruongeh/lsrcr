document.getElementById('saveButton').addEventListener('click', function() {
  const githubToken = document.getElementById('github-token').value;
  const slackWebhook = document.getElementById('slack-webhook').value;
  const myEmail = document.getElementById('my-email').value;


  // Save to storage
  chrome.storage.local.set({ 'github-token': githubToken }, function() {
    console.log('Github token variable saved');
  });
  chrome.storage.local.set({ 'slack-webhook': slackWebhook }, function() {
    console.log('Slack webhook variable saved');
  });
  chrome.storage.local.set({ 'my-email': myEmail }, function() {
    console.log('My email variable saved');
  });
});

window.onload = (e) => {
  e.preventDefault();

  chrome.storage.local.get(['github-token', 'slack-webhook', 'my-email'], function(result) {
    const githubToken = result['github-token'];
    const slackWebhook = result['slack-webhook'];
    const myEmail = result['my-email'];

    document.getElementById('github-token').value = githubToken;
    document.getElementById('slack-webhook').value = slackWebhook;
    document.getElementById('my-email').value = myEmail;
  });
}
