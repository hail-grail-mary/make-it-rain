function getClientDeviceInfo() {
  // Get the user agent string
  const userAgent = navigator.userAgent;

  // Determine the platform
  const platform = navigator.platform;

  // Get the browser information
  const browserInfo = (() => {
    if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
      return "Internet Explorer";
    } else {
      return "Unknown Browser";
    }
  })();

  // Get the device type
  const deviceType = /Mobi|Android/i.test(userAgent) ? "Mobile" : "Desktop";

  // Get the architecture (32-bit or 64-bit)
  const architecture = navigator.userAgent.includes("x64") ? "64-bit" : "32-bit";

  // Get the operating system
  let os = "Unknown OS";
  if (userAgent.indexOf("Win") !== -1) {
    os = "Windows";
  } else if (userAgent.indexOf("Mac") !== -1) {
    os = "MacOS";
  } else if (userAgent.indexOf("Linux") !== -1) {
    os = "Linux";
  } else if (userAgent.indexOf("Android") !== -1) {
    os = "Android";
  } else if (userAgent.indexOf("like Mac") !== -1) {
    os = "iOS";
  }

  // Return the device information
  return {
    userAgent,
    platform,
    browser: browserInfo,
    deviceType,
    architecture,
    operatingSystem: os,
  };
}

// Example usage
const deviceInfo = getClientDeviceInfo();

