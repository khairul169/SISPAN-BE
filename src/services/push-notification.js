const { default: axios } = require("axios");

const pushNotification = async (userId, message) => {
  try {
    const baseUrl = "https://onesignal.com/api/v1/notifications";
    const target = Array.isArray(userId)
      ? userId.map((i) => `${i}`)
      : [`${userId}`];

    const params = {
      app_id: process.env.ONESIGNAL_APP_ID,
      include_external_user_ids: target,
      channel_for_external_user_ids: "push",
      contents: { en: message },
    };

    const { data: result } = await axios.post(baseUrl, params, {
      headers: { Authorization: `Basic ${process.env.ONESIGNAL_API_KEY}` },
    });

    if (!result?.id) {
      throw new Error("Push notification fail! " + result.errors[0]);
    }

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

module.exports = { pushNotification };
