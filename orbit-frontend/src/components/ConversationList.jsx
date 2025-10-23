// src/components/ConversationList.jsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  Typography,
} from '@mui/material';

function ConversationList({ conversations, onSelect, selected, userId }) {
  return (
    <List>
      {conversations.map((conv) => {
        // Find last message
        const lastMessage = conv.messages[conv.messages.length - 1];
        const isUnread =
          lastMessage && lastMessage.sender._id !== userId && !lastMessage.seen;

        return (
          <ListItem
            key={conv._id}
            button
            selected={conv._id === selected?._id}
            onClick={() => onSelect(conv)}
            alignItems="flex-start"
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color={conv.online ? 'success' : 'default'}
              >
                <Avatar src={conv.avatar} alt={conv.name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: conv._id === selected?._id ? 'bold' : 'normal' }}
                >
                  {conv.name}
                </Typography>
              }
              secondary={
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    sx={{ maxWidth: 'calc(100% - 50px)' }}
                  >
                    {lastMessage
                      ? lastMessage.text || (lastMessage.file && '📎 Attachment')
                      : 'No messages yet'}
                  </Typography>
                  {lastMessage && (
                    <Typography variant="caption" color="text.secondary">
                      {new Date(lastMessage.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  )}
                  {isUnread && (
                    <Badge
                      color="primary"
                      variant="dot"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
              }
            />
          </ListItem>
        );
      })}
    </List>
  );
}

export default ConversationList;
