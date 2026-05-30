import prisma from '../config/database.js';

export const createChatSession = async (guestId, staffId = null) => {
  return await prisma.chatSession.create({
    data: {
      guestId,
      staffId,
      status: 'active',
    },
    include: {
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

export const getChatSession = async (sessionId) => {
  return await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: {
      messages: {
        include: {
          sender: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

export const getUserChatSessions = async (userId) => {
  return await prisma.chatSession.findMany({
    where: {
      OR: [
        { guestId: userId },
        { staff: { userId } },
      ],
    },
    include: {
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};

export const addMessage = async (sessionId, senderId, message, messageType = 'text', metadata = null) => {
  const chatMessage = await prisma.chatMessage.create({
    data: {
      sessionId,
      senderId,
      message,
      messageType,
      metadata,
    },
    include: {
      sender: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
  });

  await prisma.chatSession.update({
    where: { id: sessionId },
    data: { updatedAt: new Date() },
  });

  return chatMessage;
};

export const updateChatSessionData = async (sessionId, guestData) => {
  return await prisma.chatSession.update({
    where: { id: sessionId },
    data: { guestData },
  });
};

export const assignStaffToSession = async (sessionId, staffId) => {
  return await prisma.chatSession.update({
    where: { id: sessionId },
    data: { staffId },
    include: {
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });
};

export const closeChatSession = async (sessionId) => {
  return await prisma.chatSession.update({
    where: { id: sessionId },
    data: { status: 'closed' },
  });
};

export const getActiveSessions = async () => {
  return await prisma.chatSession.findMany({
    where: { status: 'active' },
    include: {
      guest: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      staff: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { updatedAt: 'desc' },
  });
};
