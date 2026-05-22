import sys
import os
import objc
from Foundation import NSURL
from Vision import VNImageRequestHandler, VNRecognizeTextRequest

def ocr_image(image_path):
    if not os.path.exists(image_path):
        return f"File not found: {image_path}"
    
    url = NSURL.fileURLWithPath_(image_path)
    request_handler = VNImageRequestHandler.alloc().initWithURL_options_(url, None)
    
    recognized_text = []
    
    def completion_handler(request, error):
        if error:
            print(f"Error: {error}")
            return
        results = request.results()
        for observation in results:
            candidates = observation.topCandidates_(1)
            if candidates:
                recognized_text.append(candidates[0].string())
                
    request = VNRecognizeTextRequest.alloc().initWithCompletionHandler_(completion_handler)
    # Set recognition level to accurate
    request.setRecognitionLevel_(0) # 0 is VNRequestTextRecognitionLevelAccurate
    # Set language
    request.setRecognitionLanguages_(["zh-Hant", "en-US"])
    
    success, error = request_handler.performRequests_error_([request], None)
    if not success:
        return f"Failed to perform OCR: {error}"
        
    return "\n".join(recognized_text)

# Run on workspace images in question
img1_path = '/Users/pengyurui/Documents/GitHub/Betty/2be31e8a-9812-4963-b089-4f3d5919d8de.png'
print(f"=== OCR of 2be31e8a-9812-4963-b089-4f3d5919d8de.png ===")
print(ocr_image(img1_path))

img2_path = '/Users/pengyurui/Documents/GitHub/Betty/95136c5b-3834-4422-b3a6-e4e5f8476e43.png'
print(f"\n=== OCR of 95136c5b-3834-4422-b3a6-e4e5f8476e43.png ===")
print(ocr_image(img2_path))

