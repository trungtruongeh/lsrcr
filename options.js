document.getElementById('saveButton').addEventListener('click', function() {
  const slackWebhook = document.getElementById('slack-webhook').value;
  const myEmail = document.getElementById('my-email').value;


  // Save to storage
  chrome.storage.local.set({ 'slack-webhook': slackWebhook }, function() {
    console.log('Slack webhook variable saved');
  });
  chrome.storage.local.set({ 'my-email': myEmail }, function() {
    console.log('My email variable saved');
  });
});

window.onload = (e) => {
  e.preventDefault();

  chrome.storage.local.get(['slack-webhook', 'my-email'], function(result) {
    const slackWebhook = result['slack-webhook'];
    const myEmail = result['my-email'];

    document.getElementById('slack-webhook').value = slackWebhook;
    document.getElementById('my-email').value = myEmail;
  });
}
