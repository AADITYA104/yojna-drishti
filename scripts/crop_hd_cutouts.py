from PIL import Image

# Bhavnagar poster: satellite shape is located roughly x: 120 to 650, y: 130 to 600
bhav_poster = Image.open('yojana-drishti/public/images/districts/posters/bhavnagar_poster.jpg')
w, h = bhav_poster.size

# Let's crop the satellite cutout for Bhavnagar
bhav_cutout = bhav_poster.crop((120, 130, 660, 600))
bhav_tile = bhav_cutout.resize((240, 188), Image.Resampling.LANCZOS)
bhav_tile.save('yojana-drishti/public/images/districts/07.jpg', quality=95)
bhav_tile.save('yojana-drishti/public/images/districts/bhavnagar.jpg', quality=95)
print('Updated 07.jpg and bhavnagar.jpg with new high-res satellite cutout!')

# Ahmedabad poster: satellite shape is located roughly x: 130 to 670, y: 130 to 590
ahmed_poster = Image.open('yojana-drishti/public/images/districts/posters/ahmedabad_poster.jpg')
ahmed_cutout = ahmed_poster.crop((130, 130, 670, 590))
ahmed_tile = ahmed_cutout.resize((240, 188), Image.Resampling.LANCZOS)
ahmed_tile.save('yojana-drishti/public/images/districts/01.jpg', quality=95)
ahmed_tile.save('yojana-drishti/public/images/districts/ahmedabad.jpg', quality=95)
print('Updated 01.jpg and ahmedabad.jpg with new high-res satellite cutout!')
