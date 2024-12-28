const MessageNotification = ({ message, type }) => {
    if (message === null) {
      return null;
    }
  //success on vain onnistuneita tässä sovelluksessa, harjoituksen vuoksi valmius negatiivisille erroreille.
    const notificationStyle = {
      color: type === 'success' ? 'green' : 'red',
      background: 'lightgrey',
      fontSize: '20px',
      border: `2px solid ${type === 'success' ? 'green' : 'red'}`,
      borderRadius: '5px',
      padding: '10px',
      marginBottom: '10px',
    };
  
    return (
      <div style={notificationStyle}>
        {message}
      </div>
    );
  };
  
  export default MessageNotification;
  