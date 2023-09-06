"use client"
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import React from 'react'
import 'remixicon/fonts/remixicon.css'

export default function RichTextEditor() {
    const editor = useEditor({
        extensions: [StarterKit],
        content: '<p>Hello World! 🌎️</p>',
        editorProps: {
            attributes: {
                class:
                    'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none'
            }
        }
    })

    function handleBoldClick() {
        editor.chain().focus().toggleBold().run();
    }
    function handleItalicClick() {
        editor.chain().focus().toggleItalic().run();
    }
    function handleH1Click() {
        editor.chain().focus().toggleHeading({level:1}).run();
    }
    function handleH2Click() {
        editor.chain().focus().toggleHeading({level:2}).run();
    }
    function handleH3Click() {
        editor.chain().focus().toggleHeading({level:3}).run();
    }
    function handlePClick() {
        editor.chain().focus().setParagraph().run();
    }
    function handleBulletsClick() {
        editor.chain().focus().toggleBulletList().run();
    }
    function handleOLClick() {
        editor.chain().focus().toggleOrderedList().run();
    }

    return (
        <>
            <div className="flex p-3 justify-center space-x-2">
                <button onClick={handleBoldClick} className="px-4 py-2">
                    <i className="ri-bold"></i>
                </button>
                <button onClick={handleItalicClick} className="px-4 py-2">
                    <i className="ri-italic"></i>
                </button>
                <button onClick={handleH1Click} className="px-4 py-2">
                    H1
                </button>
                <button onClick={handleH2Click} className="px-4 py-2">
                    H2
                </button>
                <button onClick={handleH3Click} className="px-4 py-2">
                    H3
                </button>
                <button onClick={handlePClick} className="px-4 py-2">
                    Normal
                </button>
                <button onClick={handleBulletsClick} className="px-4 py-2">
                    <i className="ri-list-unordered"></i>
                </button>
                <button onClick={handleOLClick} className="px-4 py-2">
                    <i className="ri-list-ordered"></i>
                </button>
            </div>
            <EditorContent editor={editor} />
        </>
    )
}