let global_url, clientId, clientSecret, accessToken, startStopVal;

async function getAccessToken() {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(
      ["clientId", "clientSecret"],
      async function (result) {
        clientId = result.clientId;
        clientSecret = result.clientSecret;
        const response = await fetch("https://id.twitch.tv/oauth2/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: "client_credentials",
          }),
        });
        const data = await response.json();
        accessToken = data.access_token;
        console.log("Access token retrieved:", accessToken);
        resolve(accessToken);
      }
    );
  });
}

async function checkStreams() {
  chrome.storage.sync.get(
    ["streamers", "currentTabId"],
    async function (result) {
      const streamers = result.streamers;
      let currentTabId = result.currentTabId;
      const headers = {
        "Client-ID": clientId,
        Authorization: `Bearer ${accessToken}`,
      };

      console.log("Checking streams for the following streamers:");
      console.log(streamers);

      let liveStreamers = [];

      for (const name of streamers) {
        try {
          if (name.indexOf("v=") !== -1) {
            console.log("Youtube Stream passed!");
            liveStreamers.push(name);
            continue;
          }
          const response = await fetch(
            `https://api.twitch.tv/helix/streams?user_login=${name}`,
            {
              headers: headers,
            }
          );
          const data = await response.json();
          if (data.data.length > 0) {
            console.log(
              `${name} is live: ${data.data[0].title} playing ${data.data[0].game_name}`
            );
            liveStreamers.push(name);
          } else {
            console.log(`${name} is not live.`);
          }
        } catch (error) {
          console.error(`Error checking stream for ${name}:`, error);
        }
      }

      // Update the current tab URL with the list of live streamers
	    if (liveStreamers.length > 0) {
		    const url = "https://twitchtheater.tv/" + liveStreamers.join("/");
		    console.log("URL: ", url);
		    console.log("global_url: ", global_url);
		    if (url !== global_url) {
			    console.log("URL is different, checking if tab is alive");
			    try {
				    let tabInfo = await chrome.tabs.get(currentTabId);
				    console.log("Tab is alive");
				    chrome.tabs.update(currentTabId, { url: url });
			    } catch (error) {
				    console.log("Tab is not alive");
				    chrome.tabs.create({ url: url }).then(function (tab) {
					    currentTabId = tab.id;
					    chrome.storage.sync.set({ currentTabId: currentTabId });
					    console.log("Set TAB ID: ", currentTabId);
				    });
			    }
		    }
		    global_url = url;
		    chrome.storage.sync.set({ global_url: global_url });
	    }

    }
  );
}

// Initialize extension
chrome.runtime.onStartup.addListener(async () => {
  console.log("Extension started on browser startup");
  await getAccessToken();
  checkStreams();
  chrome.storage.sync.set({ isChecking: true });
  setInterval(async () => {
    chrome.storage.sync.get(
      ["clientId", "clientSecret", "streamers", "isChecking", "global_url"],
      function (result) {
        clientId = result.clientId || "";
        clientSecret = result.clientSecret || "";
        let streamerList = result.streamers ? result.streamers.join("\n") : "";
        console.log("Streamer list:", streamerList);
        startStopVal = result.isChecking ? "Stop" : "Start";
        global_url = result.global_url;
      }
    );
    console.log(startStopVal);
    if (startStopVal === "Stop") {
      await getAccessToken();
      checkStreams();
    }
  }, 17000); // Check streams every 30 seconds
});
