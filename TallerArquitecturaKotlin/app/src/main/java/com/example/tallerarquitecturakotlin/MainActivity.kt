package com.example.tallerarquitecturakotlin

import SimpleHttpClient
import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import androidx.constraintlayout.motion.widget.Debug
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.Observer
import java.io.Console
import java.util.concurrent.LinkedBlockingQueue


class MainActivity : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        val queryPort: String = "3000";
        val commandPort: String = "8080";

        lateinit var inputText1: EditText
        lateinit var inputText2: EditText
        lateinit var inputText3: EditText

        var resultText: TextView

        setContentView(R.layout.activity_main)

        inputText1 = findViewById(R.id.EditName)
        inputText2 = findViewById(R.id.EditEmail)
        inputText3 = findViewById(R.id.TextURL)
        resultText = findViewById(R.id.Request)

        var commandClient = SimpleHttpClient("192.168.0.12", commandPort)
        var queryClient =  SimpleHttpClient("192.168.0.12", queryPort)

        var getUsersQuery = ("{\n" +
                "  \"query\": \"query { users { _id name email } }\",\n" +
                "  \"variables\": {}\n" +
                "}")
        resultText.text = "Waiting for ip"
        val button = findViewById<Button>(R.id.botonAgregar)
        button.setOnClickListener {
            val queue = LinkedBlockingQueue<String>()
            Thread {
                var UsersQueryV2 =
                    ("{\n" +
                            "\t\"query\": \"mutation CreateUser(\$input: UserInput!){ createUser(input: \$input)}\",\n" +
                            "\t\"variables\": {\n" +
                            "\t\t\"input\": {\n" +
                            "\t\t\t\"name\": \"${inputText1.text}\",\n" +
                            "\t\t\t\"email\": \"${inputText2.text}\"\n" +
                            "\t\t}\n" +
                            "\t}\n" +
                            "}")

                commandClient = SimpleHttpClient(inputText3.text.toString(), commandPort)

                (commandClient.sendJson(UsersQueryV2))

            }.start()
            Thread(){
                queryClient = SimpleHttpClient(inputText3.text.toString(), queryPort)

                queue.add(queryClient.sendJson(getUsersQuery))
            }.start()
            resultText.text = queue.take()
        }
    }

}