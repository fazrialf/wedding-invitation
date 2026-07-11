#!/usr/bin/env python3
import os, re, json, subprocess, time

BASE_URL = "http://localhost:20128/v1/chat/completions"
with open("/tmp/ninerouter_key.txt") as f:
    API_KEY = f.read().strip()
OUT_DIR = "/home/ssm-user/wedding-invitation/frontend/public/images/ornaments"

PROMPTS = {
    "adat": {
        "hero": {
            "w": 800, "h": 600,
            "prompt": "Generate a complete SVG illustration for a wedding invitation hero section. Style: Indonesian traditional architecture and garden. Scene: grand view of traditional Minangkabau Rumah Gadang houses with distinctive curved horn-like roofs gonjong, set against misty green mountains. Three-tiered stone fountain in foreground garden. Lush tropical garden with yellow roses, white jasmine clusters, large leafy bushes. ViewBox 0 0 800 600. Sky soft teal-green gradient misty. 2-3 Rumah Gadang buildings with detailed curved roofs and gold trim. Mountain silhouettes. Three-tiered fountain. Garden with roses and jasmine. Colors: teal 4A8C7F, dark green 2D5016, gold C9A96E, wood brown 8B6914, yellow F5D547, white FFFEF5. Output ONLY the SVG code."
        },
        "corner": {
            "w": 300, "h": 300,
            "prompt": "Generate SVG for wedding invitation corner decoration. Indonesian traditional batik and floral art. Ornate corner with yellow roses and white jasmine clusters with green leaves, intertwined with gold scrollwork flourishes like traditional Indonesian ukiran carving motifs. ViewBox 0 0 300 300. Transparent background. 4-5 large yellow roses. White jasmine clusters. Green leaves with veins. Gold scrollwork C-curves and S-curves. Colors: yellow F5D547, gold C9A96E, white FFFEF5, green 5B7A3A, brown 8B6914. Output ONLY SVG code."
        },
        "divider": {
            "w": 600, "h": 80,
            "prompt": "Generate SVG for wedding invitation section divider. Indonesian traditional pattern. Horizontal decorative band with batik kawung pattern overlapping circles in center, flanked by parang diagonal lines. Gold scrollwork flourishes at each end. Small jasmine flowers. ViewBox 0 0 600 80. Transparent background. Colors: gold C9A96E, brown 8B6914, white FFFEF5, dark green 2D5016. Output ONLY SVG code."
        }
    },
    "floral": {
        "hero": {
            "w": 800, "h": 600,
            "prompt": "Generate SVG for wedding invitation hero section. Lush watercolor floral garden. Abundant rose garden in full bloom with climbing roses on an ornate iron archway, stone fountain, butterflies, cascading wisteria. ViewBox 0 0 800 600. Radial gradients for rose petals. Multiple rose varieties. Detailed leaves with serrated edges. Iron archway with scrollwork. 20 flower elements. Colors: blush E8B4B8, rose C9516E, cream FFF8E7, gold C9A96E, green 5B7A3A. Output ONLY SVG code."
        },
        "corner": {
            "w": 300, "h": 300,
            "prompt": "Generate SVG for wedding invitation corner decoration. Lush watercolor floral cluster. Cascading bouquet of roses, peonies, and baby breath with trailing vines. ViewBox 0 0 300 300. Transparent background. 3-4 large roses with gradient petals. 2-3 peonies. Baby breath clusters. Trailing vines. Colors: blush E8B4B8, rose C9516E, cream FFF8E7, gold C9A96E, green 5B7A3A. Output ONLY SVG code."
        },
        "divider": {
            "w": 600, "h": 80,
            "prompt": "Generate SVG for wedding invitation section divider. Floral vine trail. Horizontal trail of climbing roses and jasmine connected by flowing green vines. Central larger rose with buds on each side. ViewBox 0 0 600 80. Transparent background. Flowing vine S-curves. 1 central rose with gradient. 4 smaller buds. Tiny jasmine clusters. Colors: rose C9516E, blush E8B4B8, green 5B7A3A. Output ONLY SVG code."
        }
    },
    "nature": {
        "hero": {
            "w": 800, "h": 600,
            "prompt": "Generate SVG for wedding invitation hero section. Painted landscape with mountains and water. Breathtaking sunset with twin volcanic mountains rising from a calm lake. Golden light reflects on water. Traditional wooden houses on stilts on left shore with palm trees. Small white birds flying. Distant boat. Lush tropical vegetation foreground with reeds and water lilies. ViewBox 0 0 800 600. Dramatic sky gradient deep orange-red to golden. Mountain silhouettes with lit and shadow sides. Water reflection ripples. Colors: sunset orange E8652D, gold F5A623, deep purple 4A1942, lake blue 1B3A5C, green 2D5016. Output ONLY SVG code."
        },
        "corner": {
            "w": 300, "h": 300,
            "prompt": "Generate SVG for wedding invitation corner decoration. Natural botanical arrangement. Lush corner of tropical ferns, bamboo stalks with visible nodes, monstera leaves, small exotic flowers. A tiny hummingbird hovering near a flower. ViewBox 0 0 300 300. Transparent background. 2-3 bamboo stalks with node rings. Large monstera leaf with holes. Fern fronds with pinnae. Small tropical flowers. Hummingbird. Colors: bamboo green 6B8E23, dark green 2D5016, teal 008080, coral FF6B6B. Output ONLY SVG code."
        },
        "divider": {
            "w": 600, "h": 80,
            "prompt": "Generate SVG for wedding invitation section divider. Nature silhouette wave. Horizontal mountain range silhouette undulating like a wave with pine trees on peaks. Below: water ripple reflection. Small birds flying above peaks. ViewBox 0 0 600 80. Transparent background. Mountain silhouette with 3-5 peaks. Pine tree silhouettes. Water reflection below. 3-5 bird silhouettes. Colors: dark teal 1B4332, green 2D6A4F, light 95D5B2. Output ONLY SVG code."
        }
    },
    "fairytale": {
        "hero": {
            "w": 800, "h": 600,
            "prompt": "Generate SVG for wedding invitation hero section. Enchanted fairytale forest with aurora. Magical forest clearing at twilight with towering ancient trees, bioluminescent mushrooms and flowers, northern lights aurora in deep blue-purple sky, fireflies floating, crystal-clear stream with glowing stones, distant fairy-tale castle spire. ViewBox 0 0 800 600. Sky deep indigo to purple with aurora streaks green teal violet. Ancient gnarled trees. Bioluminescent glowing elements. Crystal stream. Distant castle. Stars and crescent moon. Colors: deep purple 2D1B69, aurora green 00D68F, teal 00B4D8, violet 7B2FBE, gold FFD700, silver C0C0C0. Output ONLY SVG code."
        },
        "corner": {
            "w": 300, "h": 300,
            "prompt": "Generate SVG for wedding invitation corner decoration. Enchanted fairytale elements. Magical corner with crystal gem clusters, crescent moon, scattered stars, enchanted rose with glowing petals, trailing vines with bioluminescent berries, fairy light sparkles. ViewBox 0 0 300 300. Transparent background. Crescent moon. 5-8 stars varying sizes. Crystal cluster with 3-4 faceted gems. Enchanted rose with glowing petals. Trailing vine with luminous berries. Sparkle effects. Colors: silver C0C0C0, violet 7B2FBE, aurora green 00D68F, rose gold E8B4B8, gold FFD700. Output ONLY SVG code."
        },
        "divider": {
            "w": 600, "h": 80,
            "prompt": "Generate SVG for wedding invitation section divider. Enchanted starfield trail. Horizontal trail of scattered stars, tiny sparkles, flowing magical ribbon undulating across width. Small crystal shapes and crescent moons at intervals. Trail fades at both ends. ViewBox 0 0 600 80. Transparent background. Central flowing ribbon gradient violet to teal. 15-20 stars. Sparkle crosses. 2-3 tiny crescent moons. Crystal diamonds. Fade at edges. Colors: violet 7B2FBE, teal 00B4D8, silver C0C0C0, gold FFD700. Output ONLY SVG code."
        }
    },
    "minimalist": {
        "hero": {
            "w": 800, "h": 600,
            "prompt": "Generate SVG for wedding invitation hero section. Elegant minimalist botanical art. Serene garden with tall slender cypress trees, reflective marble pool in center, soft morning light, delicate wildflowers scattered along stone path. Pale ivory and gold palette with sage green accents. ViewBox 0 0 800 600. Gradients for sky soft ivory to warm gold. Detailed botanical elements. Marble stone textures. Subtle gold vein patterns. 15 distinct plant elements. Output ONLY SVG code."
        },
        "corner": {
            "w": 300, "h": 300,
            "prompt": "Generate SVG for wedding invitation corner decoration. Elegant minimalist botanical line art. Graceful arrangement of eucalyptus branches, olive leaves, and small geometric diamonds forming L-shaped corner ornament. Gold and sage green on transparent background. ViewBox 0 0 300 300. Transparent background. Detailed leaf shapes with veins. Thin elegant stems. Gold diamond accents. Colors: gold C9A96E, sage 8B9A6B, brown 8B7355. Output ONLY SVG code."
        },
        "divider": {
            "w": 600, "h": 80,
            "prompt": "Generate SVG for wedding invitation section divider. Elegant minimalist. Thin horizontal gold line with central octagonal medallion containing fine filigree, flanked by small olive leaf pairs and tiny diamonds. ViewBox 0 0 600 80. Transparent background. Colors: gold C9A96E, ivory E8D5A3. Output ONLY SVG code."
        }
    }
}

def call_api(prompt):
    payload = json.dumps({
        "model": "hermes-image",
        "stream": False,
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 8192
    })
    result = subprocess.run(
        ["curl", "-s", BASE_URL,
         "-H", "Authorization: Bearer " + API_KEY,
         "-H", "Content-Type: application/json",
         "-d", payload, "--max-time", "120"],
        capture_output=True, text=True, timeout=130
    )
    if result.returncode != 0:
        print(f"    API error: {result.stderr}")
        return None
    try:
        data = json.loads(result.stdout)
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"    Parse error: {e}")
        print(f"    Raw: {result.stdout[:300]}")
        return None

def extract_svg(content):
    m = re.search(r'(<svg[\s\S]*?</svg>)', content, re.IGNORECASE)
    if m:
        return m.group(1)
    m = re.search(r'```(?:svg|xml)?\s*([\s\S]*?)```', content)
    if m and '<svg' in m.group(1):
        return m.group(1).strip()
    return None

def convert_png(svg_content, png_path, w, h):
    svg_path = png_path.replace('.png', '.svg')
    with open(svg_path, 'w') as f:
        f.write(svg_content)
    result = subprocess.run(
        ["cairosvg", svg_path, "-o", png_path, "-W", str(w), "-H", str(h)],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        print(f"    cairosvg error: {result.stderr}")
        return False
    size = os.path.getsize(png_path)
    print(f"    -> PNG: {os.path.basename(png_path)} ({size:,} bytes)")
    return True

def main():
    print("=" * 60)
    print("Wedding Invitation Art Generator")
    print(f"API Key: {'SET' if API_KEY else 'MISSING'}")
    print("=" * 60)
    
    total, success = 0, 0
    
    for cat, arts in PROMPTS.items():
        print(f"\n[{cat.upper()}]")
        for art_type, spec in arts.items():
            total += 1
            png_path = os.path.join(OUT_DIR, cat, art_type, f"{art_type}.png")
            
            if os.path.exists(png_path) and os.path.getsize(png_path) > 1000:
                print(f"  SKIP {art_type} (exists)")
                success += 1
                continue
            
            print(f"  Generating {art_type} ({spec['w']}x{spec['h']})...")
            content = call_api(spec["prompt"])
            
            if content:
                svg = extract_svg(content)
                if svg:
                    if convert_png(svg, png_path, spec['w'], spec['h']):
                        success += 1
                    else:
                        print(f"    FAIL: PNG conversion")
                else:
                    print(f"    FAIL: No SVG found")
                    print(f"    Preview: {content[:200]}")
            else:
                print(f"    FAIL: No response")
            
            time.sleep(2)
    
    print(f"\n{'=' * 60}")
    print(f"Done: {success}/{total} generated successfully")

if __name__ == "__main__":
    main()
