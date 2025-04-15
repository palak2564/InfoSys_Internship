package com.example.controller;

import com.example.model.Post;
import com.example.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository repo;

    // Change the upload directory to an absolute path
    private static final String UPLOAD_DIR = "C:/Users/palak/Downloads/demo/uploads";

    @PostMapping
    public Post createPost(@RequestParam("image") MultipartFile file,
                           @RequestParam("description") String description) throws Exception {
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();  // Create directories if they don't exist
        }

        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File dest = new File(uploadDir, filename);
        file.transferTo(dest);

        Post post = new Post();
        post.setImage(filename);
        post.setDescription(description);
        post.setCreatedAt(LocalDateTime.now());
        return repo.save(post);
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return repo.findAll();
    }

    @PutMapping("/{id}/like")
    public Post likePost(@PathVariable String id) {
        Post post = repo.findById(id).orElseThrow();
        post.setLikes(post.getLikes() + 1);
        return repo.save(post);
    }
}
