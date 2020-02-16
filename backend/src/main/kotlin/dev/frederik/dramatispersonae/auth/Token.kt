package dev.frederik.dramatispersonae.auth

data class TokenSet(val accessToken: String, val idToken: String, val refreshToken: String, val expiresIn: Int)

data class RefreshedTokenSet(val accessToken: String, val idToken: String, val expiresIn: Int)