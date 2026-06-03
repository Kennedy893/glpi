<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;
use Twig\TemplateWrapper;

/* pages/admin/helpdesk_home_translations.html.twig */
class __TwigTemplate_1ad5c4f4c4642b148f1850f9b788e405 extends Template
{
    private Source $source;
    /**
     * @var array<string, Template>
     */
    private array $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = []): iterable
    {
        $macros = $this->macros;
        // line 32
        yield "
";
        // line 33
        $macros["fields"] = $this->macros["fields"] = $this->load("components/form/fields_macros.html.twig", 33)->unwrap();
        // line 34
        yield "
<section aria-label=\"";
        // line 35
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(_n("Helpdesk translation", "Helpdesk translations", Session::getPluralNumber()), "html", null, true);
        yield "\">
    <div class=\"mb-2\">
        <button
            type=\"button\"
            class=\"btn btn-primary\"
            data-bs-toggle=\"modal\"
            data-bs-target=\"#addLanguageModal\"
        >
            <i class=\"ti ti-plus me-1\"></i>
            ";
        // line 44
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Add language"), "html", null, true);
        yield "
        </button>
    </div>

    <div class=\"card rounded\">
        ";
        // line 49
        yield from $this->load("components/datatable.html.twig", 49)->unwrap()->yield(CoreExtension::toArray(["datatable_id" => "glpi-helpdesk-translations-languages", "container_class" => "rounded", "columns" => ["language" => __("Language"), "translated" => __("Translated"), "translations_to_do" => __("Translations to do"), "translations_to_review" => __("Obsolete translations")], "formatters" => ["language" => "raw_html", "translated" => "progress"], "entries" => Twig\Extension\CoreExtension::map($this->env,         // line 62
($context["translations"] ?? null), function ($__translation__) use ($context, $macros) { $context["translation"] = $__translation__; return ["language" => Twig\Extension\CoreExtension::include($this->env, $context, "pages/admin/helpdesk_home_translation.html.twig", ["item" =>         // line 64
($context["item"] ?? null), "can_update" => true, "helpdesk_translation" =>         // line 66
($context["translation"] ?? null)]), "translated" => CoreExtension::getAttribute($this->env, $this->source,         // line 68
($context["translation"] ?? null), "getTranslatedPercentage", [], "method", false, false, false, 68), "translations_to_do" => CoreExtension::getAttribute($this->env, $this->source,         // line 69
($context["translation"] ?? null), "getTranslationsToDo", [], "method", false, false, false, 69), "translations_to_review" => CoreExtension::getAttribute($this->env, $this->source,         // line 70
($context["translation"] ?? null), "getTranslationsToReview", [], "method", false, false, false, 70)]; }), "total_number" => 1, "nofilter" => true]));
        // line 75
        yield "    </div>

    ";
        // line 78
        yield "    <div class=\"modal fade\" id=\"addLanguageModal\" tabindex=\"-1\" aria-labelledby=\"addLanguageModalLabel\" aria-hidden=\"true\">
        <div class=\"modal-dialog\">
            <div class=\"modal-content\">
                <form
                    action=\"";
        // line 82
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Glpi\Application\View\Extension\RoutingExtension']->path("/Helpdesk/Translation/Add"), "html", null, true);
        yield "\"
                    method=\"POST\"
                    data-glpi-helpdesk-translations-add-language-container=\"\"
                >
                    <div class=\"modal-header\">
                        <h5 class=\"modal-title\" id=\"addLanguageModalLabel\">";
        // line 87
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Add language"), "html", null, true);
        yield "</h5>
                        <button type=\"button\" class=\"btn-close\" data-bs-dismiss=\"modal\" aria-label=\"";
        // line 88
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Close"), "html", null, true);
        yield "\"></button>
                    </div>
                    <div class=\"modal-body\">
                        <input type=\"hidden\" name=\"_glpi_csrf_token\" value=\"";
        // line 91
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Session::getNewCSRFToken(), "html", null, true);
        yield "\" />
                        ";
        // line 92
        yield $macros["fields"]->getTemplateForMacro("macro_dropdownArrayField", $context, 92, $this->getSourceContext())->macro_dropdownArrayField(...["language", __("Select language to translate"),         // line 95
($context["available_languages"] ?? null), "", ["display_emptychoice" => true, "emptylabel" => __("Select language to translate"), "aria_label" => __("Select language to translate"), "no_label" => true, "full_width" => true, "mb" => ""]]);
        // line 105
        yield "
                    </div>
                    <div class=\"modal-footer\">
                        <button type=\"button\" class=\"btn btn-outline-secondary\" data-bs-dismiss=\"modal\">
                            ";
        // line 109
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Cancel"), "html", null, true);
        yield "
                        </button>
                        <button type=\"submit\" class=\"btn btn-primary\" data-glpi-helpdesk-translations-add-language-button=\"\">
                            ";
        // line 112
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Add"), "html", null, true);
        yield "
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</section>

<script>
    \$(function() {
        // Check if we need to open a translation modal on page load
        // First check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const openTranslation = urlParams.get('open_translation');

        if (openTranslation) {
            // Open the modal for the specified language
            \$(`#helpdesk-translation-modal-\${openTranslation}`).modal('show');
        }
    });
</script>
";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "pages/admin/helpdesk_home_translations.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable(): bool
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo(): array
    {
        return array (  125 => 112,  119 => 109,  113 => 105,  111 => 95,  110 => 92,  106 => 91,  100 => 88,  96 => 87,  88 => 82,  82 => 78,  78 => 75,  76 => 70,  75 => 69,  74 => 68,  73 => 66,  72 => 64,  71 => 62,  70 => 49,  62 => 44,  50 => 35,  47 => 34,  45 => 33,  42 => 32,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "pages/admin/helpdesk_home_translations.html.twig", "C:\\wamp64\\www\\glpi\\templates\\pages\\admin\\helpdesk_home_translations.html.twig");
    }
}
