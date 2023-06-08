import { combineReducers } from "redux";
import { UPDATE_MESSAGE } from "../action/message";
import { RESET_MESSAGES, UPDATE_MESSAGES } from "../action/messages";

const message = (message = [], action) => {
  switch (action.type) {
    case UPDATE_MESSAGE:
      message = [];
      return { message: action.message };
    default:
      return message;
  }
};

const messages = (messages = [], action) => {
  switch (action.type) {
    case UPDATE_MESSAGES:
      messages = [];
      return { messages: action.messages };
    case RESET_MESSAGES:
      return { messages: action.messages };
    default:
      return messages;
  }
};

export default combineReducers({ message, messages });
