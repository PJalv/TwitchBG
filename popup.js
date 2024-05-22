let global_url, clientId, clientSecret, accessToken, startStopVal;
// document.addEventListener('DOMContentLoaded', function () {
let clientIdInput = document.getElementById('clientId');
let clientSecretInput = document.getElementById('clientSecret');
let streamerListInput = document.getElementById('streamerList');
let saveSettingsButton = document.getElementById('saveSettings');
let saveStreamersButton = document.getElementById('saveStreamers');
let startStopButton = document.getElementById('startStop');


// Load settings from storage
chrome.storage.sync.get(['clientId', 'clientSecret', 'streamers', 'isChecking', 'global_url'], function (result) {
  clientIdInput.value = result.clientId || '';
  clientSecretInput.value = result.clientSecret || '';
  streamerListInput.value = result.streamers ? result.streamers.join('\n') : '';
  startStopButton.textContent = result.isChecking ? 'Stop' : 'Start';
  global_url = result.global_url;
  clientId = clientIdInput.value;
  clientSecret = clientSecretInput.value;
  startStopVal = startStopButton.textContent;
});

// Save settings button event listener
saveSettingsButton.addEventListener('click', function () {
  clientId = clientIdInput.value;
  clientSecret = clientSecretInput.value;
  chrome.storage.sync.set({
    'clientId': clientId,
    'clientSecret': clientSecret
  }, function () {
    console.log('Settings saved');
  });
});

// Save streamers button event listener
saveStreamersButton.addEventListener('click', function () {
  let streamers = streamerListInput.value.split('\n').filter(streamer => streamer.trim() !== '');
  chrome.storage.sync.set({ 'streamers': streamers }, function () {
    console.log('Streamers saved:', streamers);
  });
});

// Start/Stop button event listener
startStopButton.addEventListener('click', function () {
  chrome.storage.sync.get('isChecking', function (result) {
    const isChecking = result.isChecking || false;
    if (isChecking) {
      // Stop checking streams
      chrome.storage.sync.set({ 'isChecking': false });
      startStopButton.textContent = 'Start';
      
      console.log('Stopped checking streams.');
    } else {
      // Start checking streams
      chrome.storage.sync.set({ 'isChecking': true });
      startStopButton.textContent = 'Stop';
      
      console.log('Started checking streams.');
    }
  });

});

