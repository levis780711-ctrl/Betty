import Foundation
import Vision
import Cocoa

func performOCR(on imagePath: String) {
    let url = URL(fileURLWithPath: imagePath)
    let requestHandler = VNImageRequestHandler(url: url, options: [:])
    
    let request = VNRecognizeTextRequest { request, error in
        if let error = error {
            print("Error: \(error.localizedDescription)")
            return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else {
            return
        }
        for observation in observations {
            if let candidate = observation.topCandidates(1).first {
                print(candidate.string)
            }
        }
    }
    
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["zh-Hant", "en-US"]
    
    do {
        try requestHandler.perform([request])
    } catch {
        print("Failed to perform OCR request: \(error.localizedDescription)")
    }
}

let args = CommandLine.arguments
if args.count > 1 {
    performOCR(on: args[1])
} else {
    print("Please provide an image path.")
}
