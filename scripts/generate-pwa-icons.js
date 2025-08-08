const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Path to new logo PNG
const logoPath = path.join(__dirname, '../public/latest version.png');

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
            await sharp(logoPath)
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
        await sharp(logoPath)
            .resize(maskableSize, maskableSize)
            .png()
            .toFile(path.join(iconsDir, 'icon-maskable.png'));
        
        console.log('✓ Created icon-maskable.png');
    } catch (error) {
        console.error('✗ Error creating maskable icon:', error.message);
    }
    
    // Create apple-touch-icon (180x180)
    try {
        await sharp(logoPath)
            .resize(180, 180)
            .png()
            .toFile(path.join(__dirname, '../public/apple-touch-icon.png'));
        
        console.log('✓ Created apple-touch-icon.png');
    } catch (error) {
        console.error('✗ Error creating apple-touch-icon:', error.message);
    }
    
    // Create favicon.ico (32x32)
    try {
        await sharp(logoPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(__dirname, '../public/favicon.png'));
        
        console.log('✓ Created favicon.png (use as favicon.ico alternative)');
    } catch (error) {
        console.error('✗ Error creating favicon:', error.message);
    }
    
    // Create a 16x16 version for smaller favicon
    try {
        await sharp(logoPath)
            .resize(16, 16)
            .png()
            .toFile(path.join(__dirname, '../public/favicon-16x16.png'));
        
        console.log('✓ Created favicon-16x16.png');
    } catch (error) {
        console.error('✗ Error creating favicon-16x16:', error.message);
    }
    
    // Create a 32x32 version for favicon
    try {
        await sharp(logoPath)
            .resize(32, 32)
            .png()
            .toFile(path.join(__dirname, '../public/favicon-32x32.png'));
        
        console.log('✓ Created favicon-32x32.png');
    } catch (error) {
        console.error('✗ Error creating favicon-32x32:', error.message);
    }
    
    console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);