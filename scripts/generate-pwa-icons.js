const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Path to new logo SVG
const logoPath = path.join(__dirname, 'new-logo-to-replace-others.svg');

// Read the logo SVG
const logoSvg = fs.readFileSync(logoPath, 'utf8');

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '../public/icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons
async function generateIcons() {
    console.log('Generating PWA icons from new logo...\n');
    
    for (const size of sizes) {
        const filename = `icon-${size}x${size}.png`;
        const filepath = path.join(iconsDir, filename);
        
        try {
            await sharp(Buffer.from(logoSvg))
                .resize(size, size)
                .png()
                .toFile(filepath);
            
            console.log(`✓ Created ${filename}`);
        } catch (error) {
            console.error(`✗ Error creating ${filename}:`, error.message);
        }
    }
    
    // Create maskable icon (with padding for safe area)
    const maskableSize = 512;
    try {
        await sharp(Buffer.from(logoSvg))
            .resize(maskableSize, maskableSize)
            .png()
            .toFile(path.join(iconsDir, 'icon-maskable.png'));
        
        console.log('✓ Created icon-maskable.png');
    } catch (error) {
        console.error('✗ Error creating maskable icon:', error.message);
    }
    
    // Create apple-touch-icon (180x180)
    try {
        await sharp(Buffer.from(logoSvg))
            .resize(180, 180)
            .png()
            .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
        
        console.log('✓ Created apple-touch-icon.png');
    } catch (error) {
        console.error('✗ Error creating apple-touch-icon:', error.message);
    }
    
    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);