package com.example.tallerarquitecturakotlin

import SimpleHttpClient
import android.annotation.SuppressLint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView


class MainActivity : AppCompatActivity() {
    @SuppressLint("MissingInflatedId")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        lateinit var inputText1: EditText
        lateinit var inputText2: EditText
        lateinit var inputText3: EditText

        var resultText: TextView

        setContentView(R.layout.activity_main)

        inputText1 = findViewById(R.id.EditName)
        inputText2 = findViewById(R.id.EditEmail)
        inputText3 = findViewById(R.id.TextURL)
        resultText = findViewById(R.id.Request)

        var httpClient = SimpleHttpClient("https://example.com/api%22")

        var UsersQuery = ("{\n" +
                "  \"query\": \"query { users { _id name email } }\",\n" +
                "  \"variables\": {}\n" +
                "}")


        resultText.text = ("Query")

        val button = findViewById<Button>(R.id.botonAgregar)
        button.setOnClickListener {

            var UsersQueryV2 = ("{'query': '\n    mutation CreateUser(\$input: UserInput!) {\n        createUser(input: \$input) {\n            _id\n            name\n            email\n        }\n    }\n', 'variables': {'input': {'name': '${inputText1.text}', 'email': '${inputText2.text}'}}}")

            httpClient = SimpleHttpClient(inputText3.text.toString())

            var respuesta = (httpClient.sendJson(UsersQueryV2))

            respuesta = (httpClient.sendJson(UsersQuery))

            resultText.text = respuesta
        }
    }
}