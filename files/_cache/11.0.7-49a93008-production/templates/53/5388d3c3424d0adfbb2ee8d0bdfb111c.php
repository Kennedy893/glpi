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

/* pages/setup/general/glpinetwork_setup.html.twig */
class __TwigTemplate_1868f12aa2d60e48bdeabba2237933d0 extends Template
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
";
        // line 35
        if ((($tmp =  !($context["services_available"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 36
            yield "    <div class=\"alert alert-warning\">
        <div class=\"alert-title\">";
            // line 37
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(__("%1\$s services website seems to be unavailable from your network or offline!"), __("GLPI Network")), "html", null, true);
            yield "</div>
        <span class=\"text-secondary\">
            ";
            // line 39
            if ((($tmp =  !(null === ($context["curl_error"] ?? null))) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                // line 40
                yield "                ";
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(__("Error was: %s"), ($context["curl_error"] ?? null)), "html", null, true);
                yield "
            ";
            }
            // line 42
            yield "        </span>
    </div>
";
        }
        // line 45
        yield "
";
        // line 46
        $context["form_path"] = ((array_key_exists("form_path", $context)) ? (Twig\Extension\CoreExtension::default(($context["form_path"] ?? null), $this->extensions['Glpi\Application\View\Extension\ItemtypeExtension']->getItemtypeFormPath("Config"))) : ($this->extensions['Glpi\Application\View\Extension\ItemtypeExtension']->getItemtypeFormPath("Config")));
        // line 47
        yield "<form name=\"form\"
      action=\"";
        // line 48
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(($context["form_path"] ?? null), "html", null, true);
        yield "\"
      method=\"post\"
      data-track-changes=\"true\">
    <input type=\"hidden\" name=\"_glpi_csrf_token\" value=\"";
        // line 51
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Session::getNewCSRFToken(), "html", null, true);
        yield "\" />

    ";
        // line 53
        yield $macros["fields"]->getTemplateForMacro("macro_largeTitle", $context, 53, $this->getSourceContext())->macro_largeTitle(...[__("Registration"), "ti ti-shield-star", true]);
        yield "

    ";
        // line 55
        if (Twig\Extension\CoreExtension::testEmpty(($context["registration_key"] ?? null))) {
            // line 56
            yield "
        ";
            // line 57
            $context["registration_alert"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                // line 58
                yield "            <div class=\"alert alert-info mb-0 d-inline-flex mt-3\">
                <div class=\"alert-icon\">
                    <i class=\"ti ti-shield-check\"></i>
                </div>
                <div>
                    <h4 class=\"alert-heading\">";
                // line 63
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("A registration key is needed to use some advanced features (like the plugin marketplace) in GLPI"), "html", null, true);
                yield "</h4>
                    <div class=\"alert-description\">
                        <a href=\"";
                // line 65
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::constant("GLPI_NETWORK_SERVICES"), "html", null, true);
                yield "\" class=\"btn btn-sm btn-outline-secondary me-1\" target=\"_blank\" rel=\"noopener noreferrer\">
                            <i class=\"ti ti-external-link\"></i>
                            <span>";
                // line 67
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(Twig\Extension\CoreExtension::sprintf(__("Register on %1\$s!"), __("GLPI Network")), "html", null, true);
                yield "</span>
                        </a>
                        ";
                // line 69
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("And retrieve your key to paste it below"), "html", null, true);
                yield "
                    </div>
                </div>
            </div>
        ";
                yield from [];
            })())) ? '' : new Markup($tmp, $this->env->getCharset());
            // line 74
            yield "
        ";
            // line 75
            yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 75, $this->getSourceContext())->macro_htmlField(...["", ($context["registration_alert"] ?? null), null, ["full_width" => true]]);
            // line 77
            yield "

        ";
            // line 79
            yield $macros["fields"]->getTemplateForMacro("macro_passwordField", $context, 79, $this->getSourceContext())->macro_passwordField(...["glpinetwork_registration_key",             // line 81
($context["registration_key"] ?? null), __("Registration key"), ["full_width" => true, "is_disclosable" => true]]);
            // line 87
            yield "

    ";
        } else {
            // line 90
            yield "        ";
            if ((($tmp =  !Twig\Extension\CoreExtension::testEmpty((($_v0 = ($context["informations"] ?? null)) && is_array($_v0) || $_v0 instanceof ArrayAccess ? ($_v0["validation_message"] ?? null) : null))) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                // line 91
                yield "            ";
                $context["subscription_ok"] = ((($_v1 = ($context["informations"] ?? null)) && is_array($_v1) || $_v1 instanceof ArrayAccess ? ($_v1["is_valid"] ?? null) : null) && (($_v2 = (($_v3 = ($context["informations"] ?? null)) && is_array($_v3) || $_v3 instanceof ArrayAccess ? ($_v3["subscription"] ?? null) : null)) && is_array($_v2) || $_v2 instanceof ArrayAccess ? ($_v2["is_running"] ?? null) : null));
                // line 92
                yield "            ";
                $context["alert_sub_ok"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                    // line 93
                    yield "                <span class=\"";
                    yield (((($tmp = ($context["subscription_ok"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) ? ("text-success") : ("text-danger"));
                    yield "\">
                    <i class=\"ti ti-info-circle\"></i>
                    ";
                    // line 95
                    yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($_v4 = ($context["informations"] ?? null)) && is_array($_v4) || $_v4 instanceof ArrayAccess ? ($_v4["validation_message"] ?? null) : null), "html", null, true);
                    yield "
                </span>
            ";
                    yield from [];
                })())) ? '' : new Markup($tmp, $this->env->getCharset());
                // line 98
                yield "            ";
                yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 98, $this->getSourceContext())->macro_htmlField(...["", ($context["alert_sub_ok"] ?? null), null, ["full_width" => true]]);
                // line 100
                yield "
        ";
            }
            // line 102
            yield "
        ";
            // line 103
            if ((($tmp = (($_v5 = ($context["informations"] ?? null)) && is_array($_v5) || $_v5 instanceof ArrayAccess ? ($_v5["is_valid"] ?? null) : null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
                // line 104
                yield "            ";
                yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 104, $this->getSourceContext())->macro_htmlField(...["", $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($_v6 = (($_v7 = ($context["informations"] ?? null)) && is_array($_v7) || $_v7 instanceof ArrayAccess ? ($_v7["subscription"] ?? null) : null)) && is_array($_v6) || $_v6 instanceof ArrayAccess ? ($_v6["title"] ?? null) : null)), __("Subscription"), ["full_width" => true]]);
                // line 106
                yield "

            ";
                // line 108
                yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 108, $this->getSourceContext())->macro_htmlField(...["", Twig\Extension\CoreExtension::sprintf(__("From %1\$s to %2\$s"), (("<b>" . $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Glpi\Application\View\Extension\DataHelpersExtension']->getFormattedDate((($_v8 = (($_v9 = ($context["informations"] ?? null)) && is_array($_v9) || $_v9 instanceof ArrayAccess ? ($_v9["subscription"] ?? null) : null)) && is_array($_v8) || $_v8 instanceof ArrayAccess ? ($_v8["begin_date"] ?? null) : null)))) . "</b>"), (("<b>" . $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Glpi\Application\View\Extension\DataHelpersExtension']->getFormattedDate((($_v10 = (($_v11 = ($context["informations"] ?? null)) && is_array($_v11) || $_v11 instanceof ArrayAccess ? ($_v11["subscription"] ?? null) : null)) && is_array($_v10) || $_v10 instanceof ArrayAccess ? ($_v10["end_date"] ?? null) : null)))) . "</b>")), __("Period"), ["full_width" => true]]);
                // line 110
                yield "

            ";
                // line 112
                yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 112, $this->getSourceContext())->macro_htmlField(...["", $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((($_v12 = (($_v13 = ($context["informations"] ?? null)) && is_array($_v13) || $_v13 instanceof ArrayAccess ? ($_v13["owner"] ?? null) : null)) && is_array($_v12) || $_v12 instanceof ArrayAccess ? ($_v12["name"] ?? null) : null)), __("Registered by"), ["full_width" => true]]);
                // line 114
                yield "
        ";
            }
            // line 116
            yield "
        ";
            // line 117
            $context["clear_btn"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
                // line 118
                yield "            <button type=\"submit\" name=\"reset_registration_key\" value=\"1\" class=\"ms-auto btn btn-outline-danger\">
                <i class=\"ti ti-x\"></i>
                <span>";
                // line 120
                yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Remove registration key"), "html", null, true);
                yield "</span>
            </button>
        ";
                yield from [];
            })())) ? '' : new Markup($tmp, $this->env->getCharset());
            // line 123
            yield "
        ";
            // line 124
            yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 124, $this->getSourceContext())->macro_htmlField(...["", ($context["clear_btn"] ?? null), null, ["full_width" => true]]);
            // line 126
            yield "
    ";
        }
        // line 128
        yield "


    ";
        // line 131
        yield $macros["fields"]->getTemplateForMacro("macro_largeTitle", $context, 131, $this->getSourceContext())->macro_largeTitle(...[__("Marketplace"), "ti ti-puzzle"]);
        yield "


    ";
        // line 134
        yield $macros["fields"]->getTemplateForMacro("macro_dropdownArrayField", $context, 134, $this->getSourceContext())->macro_dropdownArrayField(...["marketplace_replace_plugins", Twig\Extension\CoreExtension::default($this->extensions['Glpi\Application\View\Extension\ConfigExtension']->config("marketplace_replace_plugins"), 1), ["1" => __("Ask before replacing"), "2" => __("Replace plugins page with marketplace"), "3" => __("Never replace plugins page")], __("Plugin page replacement"), ["full_width" => true, "helper" => __("Choose whether to replace the classic plugins page with the new marketplace interface.")]]);
        // line 147
        yield "

    ";
        // line 149
        $context["btns_marketplace"] = ('' === $tmp = \Twig\Extension\CoreExtension::captureOutput((function () use (&$context, $macros, $blocks) {
            // line 150
            yield "        <a href=\"";
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape($this->extensions['Glpi\Application\View\Extension\RoutingExtension']->path("/front/marketplace.php"), "html", null, true);
            yield "\" class=\"btn btn-outline-secondary btn-sm\">
            <i class=\"ti ti-arrow-narrow-right-dashed\"></i>
            <span>";
            // line 152
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(__("Access GLPI Network Marketplace"), "html", null, true);
            yield "</span>
        </a>
    ";
            yield from [];
        })())) ? '' : new Markup($tmp, $this->env->getCharset());
        // line 155
        yield "
    ";
        // line 156
        yield $macros["fields"]->getTemplateForMacro("macro_htmlField", $context, 156, $this->getSourceContext())->macro_htmlField(...["", ($context["btns_marketplace"] ?? null), null, ["full_width" => true]]);
        // line 158
        yield "

    ";
        // line 160
        if ((($tmp = ($context["canedit"] ?? null)) && $tmp instanceof Markup ? (string) $tmp : $tmp)) {
            // line 161
            yield "        <div class=\"card-footer mx-n2 d-flex\">
            <button type=\"submit\" name=\"update\" value=\"1\" class=\"ms-auto btn btn-primary\">
                <i class=\"ti ti-device-floppy\"></i>
                <span>";
            // line 164
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(_x("button", "Save"), "html", null, true);
            yield "</span>
            </button>
        </div>
    ";
        }
        // line 168
        yield "</form>
";
        yield from [];
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName(): string
    {
        return "pages/setup/general/glpinetwork_setup.html.twig";
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
        return array (  285 => 168,  278 => 164,  273 => 161,  271 => 160,  267 => 158,  265 => 156,  262 => 155,  255 => 152,  249 => 150,  247 => 149,  243 => 147,  241 => 134,  235 => 131,  230 => 128,  226 => 126,  224 => 124,  221 => 123,  214 => 120,  210 => 118,  208 => 117,  205 => 116,  201 => 114,  199 => 112,  195 => 110,  193 => 108,  189 => 106,  186 => 104,  184 => 103,  181 => 102,  177 => 100,  174 => 98,  167 => 95,  161 => 93,  158 => 92,  155 => 91,  152 => 90,  147 => 87,  145 => 81,  144 => 79,  140 => 77,  138 => 75,  135 => 74,  126 => 69,  121 => 67,  116 => 65,  111 => 63,  104 => 58,  102 => 57,  99 => 56,  97 => 55,  92 => 53,  87 => 51,  81 => 48,  78 => 47,  76 => 46,  73 => 45,  68 => 42,  62 => 40,  60 => 39,  55 => 37,  52 => 36,  50 => 35,  47 => 34,  45 => 33,  42 => 32,);
    }

    public function getSourceContext(): Source
    {
        return new Source("", "pages/setup/general/glpinetwork_setup.html.twig", "C:\\wamp64\\www\\glpi\\templates\\pages\\setup\\general\\glpinetwork_setup.html.twig");
    }
}
