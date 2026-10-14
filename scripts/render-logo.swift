// Offline vector-to-PNG renderer for the original branding SVG; macOS only.
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

final class LogoRenderer: NSObject, XMLParserDelegate {
    let context: CGContext
    init(_ context: CGContext) { self.context = context }
    func color(_ hex: String) -> CGColor {
        let value = UInt32(hex.dropFirst(), radix: 16)!
        return CGColor(srgbRed: CGFloat((value >> 16) & 255) / 255,
                       green: CGFloat((value >> 8) & 255) / 255,
                       blue: CGFloat(value & 255) / 255, alpha: 1)
    }
    func parser(_ parser: XMLParser, didStartElement element: String, namespaceURI: String?, qualifiedName: String?, attributes a: [String: String]) {
        guard ["rect", "circle", "ellipse", "path"].contains(element) else { return }
        func n(_ key: String) -> CGFloat { CGFloat(Double(a[key] ?? "0")!) }
        let path: CGPath
        switch element {
        case "rect":
            path = CGPath(roundedRect: CGRect(x: n("x"), y: n("y"), width: n("width"), height: n("height")), cornerWidth: n("rx"), cornerHeight: n("rx"), transform: nil)
        case "circle", "ellipse":
            let rx = element == "circle" ? n("r") : n("rx")
            let ry = element == "circle" ? n("r") : n("ry")
            path = CGPath(ellipseIn: CGRect(x: n("cx") - rx, y: n("cy") - ry, width: rx * 2, height: ry * 2), transform: nil)
        default:
            let tokens = a["d"]!.replacingOccurrences(of: "M", with: "M ")
                .replacingOccurrences(of: "C", with: "C ").split(separator: " ").map(String.init)
            let p = CGMutablePath()
            var i = 0
            while i < tokens.count {
                let command = tokens[i]; i += 1
                func take() -> CGFloat { defer { i += 1 }; return CGFloat(Double(tokens[i])!) }
                if command == "M" { p.move(to: CGPoint(x: take(), y: take())) }
                else if command == "C" {
                    let c1 = CGPoint(x: take(), y: take()), c2 = CGPoint(x: take(), y: take())
                    p.addCurve(to: CGPoint(x: take(), y: take()), control1: c1, control2: c2)
                } else { fatalError("Unsupported vector command: \(command)") }
            }
            path = p
        }
        context.addPath(path)
        if let fill = a["fill"], fill != "none" {
            context.setFillColor(color(fill)); context.fillPath()
        } else {
            context.setStrokeColor(color(a["stroke"]!))
            context.setLineWidth(n("stroke-width"))
            context.setLineCap(a["stroke-linecap"] == "round" ? .round : .butt)
            context.strokePath()
        }
    }
}
let input = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "assets/marketplace-icon.svg"
let output = CommandLine.arguments.count > 2 ? CommandLine.arguments[2] : "assets/marketplace-icon.png"
let context = CGContext(data: nil, width: 256, height: 256, bitsPerComponent: 8, bytesPerRow: 0,
                        space: CGColorSpace(name: CGColorSpace.sRGB)!, bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
context.translateBy(x: 0, y: 256); context.scaleBy(x: 1, y: -1)
let parser = XMLParser(contentsOf: URL(fileURLWithPath: input))!
let renderer = LogoRenderer(context)
parser.delegate = renderer
guard parser.parse() else { fatalError("Invalid SVG") }
let image = context.makeImage()!
let destination = CGImageDestinationCreateWithURL(URL(fileURLWithPath: output) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(destination, image, nil)
guard CGImageDestinationFinalize(destination) else { fatalError("PNG export failed") }
print("Rendered 256×256 original vector logo: \(output)")
