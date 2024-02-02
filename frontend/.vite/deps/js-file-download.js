import {
  __commonJS
} from "./chunk-UV5CTPV7.js";

// node_modules/js-file-download/file-download.js
var require_file_download = __commonJS({
  "node_modules/js-file-download/file-download.js"(exports, module) {
    module.exports = function(data, filename, mime, bom) {
      var blobData = typeof bom !== "undefined" ? [bom, data] : [data];
      var blob = new Blob(blobData, { type: mime || "application/octet-stream" });
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(blob, filename);
      } else {
        var blobURL = window.URL && window.URL.createObjectURL ? window.URL.createObjectURL(blob) : window.webkitURL.createObjectURL(blob);
        var tempLink = document.createElement("a");
        tempLink.style.display = "none";
        tempLink.href = blobURL;
        tempLink.setAttribute("download", filename);
        if (typeof tempLink.download === "undefined") {
          tempLink.setAttribute("target", "_blank");
        }
        document.body.appendChild(tempLink);
        tempLink.click();
        setTimeout(function() {
          document.body.removeChild(tempLink);
          window.URL.revokeObjectURL(blobURL);
        }, 200);
      }
    };
  }
});
export default require_file_download();
//# sourceMappingURL=js-file-download.js.map
