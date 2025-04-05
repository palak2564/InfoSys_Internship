package com.example.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "notices")
public class Notice {
    
    @Id
    private String id;
    
    private String title;
    private String content;
    private String icon;
    private String iconBgColor;
    private Date createdAt;
    private Date updatedAt;
    private String createdBy;
    
    // Constructors
    public Notice() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    public Notice(String title, String content) {
        this.title = title;
        this.content = content;
        this.icon = "!";
        this.iconBgColor = "#f44336";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    public Notice(String title, String content, String icon, String iconBgColor) {
        this.title = title;
        this.content = content;
        this.icon = icon;
        this.iconBgColor = iconBgColor;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public String getIcon() {
        return icon;
    }
    
    public void setIcon(String icon) {
        this.icon = icon;
    }
    
    public String getIconBgColor() {
        return iconBgColor;
    }
    
    public void setIconBgColor(String iconBgColor) {
        this.iconBgColor = iconBgColor;
    }
    
    public Date getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
    
    public Date getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    @Override
    public String toString() {
        return "Notice{" +
                "id='" + id + '\'' +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
