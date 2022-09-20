from django.contrib import admin

from .models import Dictionary, WordInSet, WordsSet


class DictionaryAdmin(admin.ModelAdmin):
    list_display = ('uk_word', 'en_word', 'progress', 'user')
    list_filter = ('user',)
    search_fields = ('uk_word', 'en_word')
    ordering = ('progress', '-created_at')
    readonly_fields = ('created_at', 'updated_at')


class WordInSetAdmin(admin.ModelAdmin):
    list_display = ('uk_word', 'en_word', 'words_set')
    list_filter = ('words_set',)
    search_fields = ('uk_word', 'en_word')
    ordering = ('-created_at',)
    autocomplete_fields = ('words_set',)
    readonly_fields = ('created_at', 'updated_at')


class WordsSetAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)
    ordering = ('-created_at',)
    readonly_fields = ('created_at', 'updated_at')


admin.site.register(Dictionary, DictionaryAdmin)
admin.site.register(WordsSet, WordsSetAdmin)
admin.site.register(WordInSet, WordInSetAdmin)
