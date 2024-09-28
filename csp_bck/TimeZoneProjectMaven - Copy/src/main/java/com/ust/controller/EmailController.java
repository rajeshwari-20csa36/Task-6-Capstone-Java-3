package com.ust.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ust.dto.EmailRequest;

@RestController
@RequestMapping("/api/timezone/email")
public class EmailController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping("/send")
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        System.out.println(request.toString());
        String[] emailAddresses = request.getEmails().split(",");
        for (String email : emailAddresses) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("rajirajeshwar552@gmail.com");
            message.setTo(email.trim());
            message.setSubject(request.getTitle());
            message.setText("Date: " + request.getDate() + "\n" +
                           "Time: " + request.getTime() + "\n" +
                           "Mode: " + request.getMode());
            mailSender.send(message);
        }
        return ResponseEntity.ok("Emails sent successfully");
    }
}