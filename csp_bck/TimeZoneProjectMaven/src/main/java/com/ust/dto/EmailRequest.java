package com.ust.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class EmailRequest {
   private String title;
   private String emails;
   private String date;
   private String time;
   private String mode;

   
}
