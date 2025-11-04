//package com.aihealth.ai_health_habit_tracker;

import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.spec.ECGenParameterSpec;
import java.util.Base64;

public class VapidKeyGen {
    public static void main(String[] args) throws Exception {
        // ✅ Use standard EC (P-256) algorithm for VAPID
        KeyPairGenerator keyGen = KeyPairGenerator.getInstance("EC");
        keyGen.initialize(new ECGenParameterSpec("secp256r1")); // same curve as webpush
        KeyPair keyPair = keyGen.generateKeyPair();

        // ✅ Encode in Base64 URL-safe format
        String publicKey = Base64.getUrlEncoder().withoutPadding().encodeToString(keyPair.getPublic().getEncoded());
        String privateKey = Base64.getUrlEncoder().withoutPadding().encodeToString(keyPair.getPrivate().getEncoded());

        System.out.println("===============================================");
        System.out.println("🔑 New VAPID Keys Generated Successfully!");
        System.out.println("-----------------------------------------------");
        System.out.println("Public Key:  " + publicKey);
        System.out.println("Private Key: " + privateKey);
        System.out.println("===============================================");
    }
}
