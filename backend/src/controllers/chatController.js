import * as chatService from '../services/chatService.js';

export const createChatSession = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const session = await chatService.createChatSession(req.user.id, staffId);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const getChatSession = async (req, res, next) => {
  try {
    const session = await chatService.getChatSession(req.params.id);
    if (!session) {
      return res.status(404).json({ error: 'Chat session not found' });
    }
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const getUserChatSessions = async (req, res, next) => {
  try {
    const sessions = await chatService.getUserChatSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const addMessage = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { message, messageType, metadata } = req.body;
    const chatMessage = await chatService.addMessage(
      sessionId,
      req.user.id,
      message,
      messageType,
      metadata
    );
    res.status(201).json(chatMessage);
  } catch (error) {
    next(error);
  }
};

export const updateChatSessionData = async (req, res, next) => {
  try {
    const { guestData } = req.body;
    const session = await chatService.updateChatSessionData(req.params.id, guestData);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const assignStaffToSession = async (req, res, next) => {
  try {
    const { staffId } = req.body;
    const session = await chatService.assignStaffToSession(req.params.id, staffId);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const closeChatSession = async (req, res, next) => {
  try {
    const session = await chatService.closeChatSession(req.params.id);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const getActiveSessions = async (req, res, next) => {
  try {
    const sessions = await chatService.getActiveSessions();
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};
