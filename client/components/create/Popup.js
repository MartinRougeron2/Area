import React, { useEffect, useState, useRef } from 'react';

const createPopup = ({
  url, title, height, width,
}) => {
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;
  const externalPopup = window.open(
    url,
    title,
    `width=${width},height=${height},left=${left},top=${top}`,
  );
  return externalPopup;
};

const Popup = ({
  title = '',
  width = 500,
  height = 500,
  url,
  children,
  onCode,
  onClose,
  }) => {
  const [externalWindow, setExternalWindow] = useState(null);
  const intervalRef = useRef(null);

  const clearTimer = () => {
    window.clearInterval(intervalRef.current);
  };

  const onContainerClick = () => {
    setExternalWindow(createPopup({
      url, title, width, height,
    }));
  };

  useEffect(() => {
    if (externalWindow) {
      intervalRef.current = window.setInterval(() => {
        try {
          const currentUrl = externalWindow.location.href;
          if (currentUrl === "about:blank")
            return;
          const id = currentUrl.substring(currentUrl.indexOf('=') + 1);
          onCode(id);
          clearTimer();
          externalWindow.close();
        } catch (error) {
          console.log(error)
        } finally {
          if (!externalWindow || externalWindow.closed) {
            onClose("a");
            clearTimer();
          }
        }
      }, 700);
    }
    return () => {
      if (externalWindow) externalWindow.close();
      if (intervalRef) clearTimer();
    };
  }, [externalWindow]);

  return (
    // eslint-disable-next-line
    <div
      onClick={() => {
        onContainerClick();
      }}
    >
      { children }
    </div>
  );
};

export default Popup;
