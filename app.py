# app.py
import streamlit as st
import geocoder

# Set up the page title and header
st.title("Location Finder")
st.header("Find your current location based on IP")

# Get the current location
location = geocoder.ip('me')

# Display latitude and longitude
if location.latlng:
    latitude, longitude = location.latlng
    st.write(f"**Latitude:** {latitude}")
    st.write(f"**Longitude:** {longitude}")
else:
    st.write("Unable to retrieve location")
