export const UPDATE_MESSAGES = "UPDATE_MESSAGES";
export const RESET_MESSAGES = "RESET_MESSAGES";

export const updateMessages = (messages) => ({
  type: UPDATE_MESSAGES,
  messages,
});
export const restMessages = ([]) => ({
  type: RESET_MESSAGES,
  messages: [],
});
